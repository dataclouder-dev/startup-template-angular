class RMSProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    // Assuming mono input
    const channel = input[0];

    let sum = 0;
    for (let i = 0; i < channel.length; i++) {
      sum += channel[i] ** 2;
    }

    const rms = Math.sqrt(sum / channel.length);

    // Post a message to the main thread with the RMS value
    this.port.postMessage({ rms });

    // Copy input to output
    for (let channel = 0; channel < output.length; channel++) {
      output[channel].set(input[channel]);
    }

    return true;
  }
}

registerProcessor('rms-processor', RMSProcessor);

