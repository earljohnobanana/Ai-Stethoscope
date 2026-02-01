# THESIS/runtime/tflite_runner.py

import numpy as np

# Prefer tflite_runtime (best for Raspberry Pi)
# Fallback to TensorFlow (best for Windows dev)
try:
    from tflite_runtime.interpreter import Interpreter  # type: ignore
except Exception:
    import tensorflow as tf  # type: ignore
    Interpreter = tf.lite.Interpreter  # ✅ this is the reliable path


class TFLiteRunner:
    def __init__(self, model_path: str):
        self.interpreter = Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()

        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

        self.input_index = self.input_details[0]["index"]
        self.output_index = self.output_details[0]["index"]

        self.input_shape = tuple(self.input_details[0]["shape"])
        self.input_dtype = self.input_details[0]["dtype"]

    def predict(self, x: np.ndarray) -> np.ndarray:
        if x.dtype != self.input_dtype:
            x = x.astype(self.input_dtype)

        if tuple(x.shape) != self.input_shape:
            raise ValueError(
                f"Input shape mismatch: got {x.shape}, expected {self.input_shape}"
            )

        self.interpreter.set_tensor(self.input_index, x)
        self.interpreter.invoke()
        y = self.interpreter.get_tensor(self.output_index)

        # usually (1, num_classes)
        return y[0]
