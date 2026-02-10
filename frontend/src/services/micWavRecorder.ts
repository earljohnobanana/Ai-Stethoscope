// frontend/src/services/micWavRecorder.ts
export type MicRecorderSession = {
  stop: () => Promise<Blob>;
  cancel: () => void;
};

export async function startMicWavRecorder(targetSampleRate = 16000): Promise<MicRecorderSession> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone access is not supported in this browser.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      noiseSuppression: true,
      echoCancellation: true,
      autoGainControl: true,
    },
    video: false,
  });

  // ✅ IMPORTANT: do NOT force sampleRate here.
  // Use default AudioContext sample rate (usually matches hardware, e.g., 48000).
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const inputSampleRate = audioCtx.sampleRate;

  const source = audioCtx.createMediaStreamSource(stream);
  const processor = audioCtx.createScriptProcessor(4096, 1, 1);

  const chunks: Float32Array[] = [];
  let totalLength = 0;

  processor.onaudioprocess = (e) => {
    const input = e.inputBuffer.getChannelData(0);
    const copy = new Float32Array(input.length);
    copy.set(input);
    chunks.push(copy);
    totalLength += copy.length;
  };

  source.connect(processor);
  processor.connect(audioCtx.destination);

  const stop = async () => {
    processor.disconnect();
    source.disconnect();
    stream.getTracks().forEach((t) => t.stop());

    // Merge PCM at inputSampleRate
    const pcm = mergeFloat32(chunks, totalLength);

    // Close context after we got the PCM
    await audioCtx.close();

    // ✅ Resample to targetSampleRate (16k) if needed
    const resampled =
      inputSampleRate === targetSampleRate ? pcm : resampleLinear(pcm, inputSampleRate, targetSampleRate);

    // Encode WAV (16-bit PCM, mono) at targetSampleRate
    const wavBuffer = encodeWavPCM16(resampled, targetSampleRate);
    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  const cancel = () => {
    try {
      processor.disconnect();
      source.disconnect();
    } catch {}
    try {
      stream.getTracks().forEach((t) => t.stop());
    } catch {}
    try {
      audioCtx.close();
    } catch {}
  };

  return { stop, cancel };
}

// ---------- helpers ----------

function mergeFloat32(chunks: Float32Array[], totalLength: number) {
  const result = new Float32Array(totalLength);
  let offset = 0;
  for (const c of chunks) {
    result.set(c, offset);
    offset += c.length;
  }
  return result;
}

// Simple linear resampler: good enough for classification audio input
function resampleLinear(input: Float32Array, inRate: number, outRate: number) {
  const ratio = inRate / outRate;
  const outLength = Math.floor(input.length / ratio);
  const output = new Float32Array(outLength);

  for (let i = 0; i < outLength; i++) {
    const pos = i * ratio;
    const idx = Math.floor(pos);
    const frac = pos - idx;

    const a = input[idx] ?? 0;
    const b = input[idx + 1] ?? a;
    output[i] = a + (b - a) * frac;
  }

  return output;
}

function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function encodeWavPCM16(samples: Float32Array, sampleRate: number) {
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");

  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);

  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  floatTo16BitPCM(view, 44, samples);
  return buffer;
}
