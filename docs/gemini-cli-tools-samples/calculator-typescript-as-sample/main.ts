interface CalculatorInput {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  num1: number;
  num2: number;
}

function calculate(operation: string, num1: number, num2: number): number {
  switch (operation) {
    case 'add':
      return num1 + num2;
    case 'subtract':
      return num1 - num2;
    case 'multiply':
      return num1 * num2;
    case 'divide':
      if (num2 === 0) {
        throw new Error('Cannot divide by zero');
      }
      return num1 / num2;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function main() {
  try {
    // Read JSON input from stdin
    const decoder = new TextDecoder();
    const input: Uint8Array = new Uint8Array(1024);
    const bytesRead = await Deno.stdin.read(input);

    if (bytesRead === null) {
      throw new Error('No input received');
    }

    const inputText = decoder.decode(input.subarray(0, bytesRead)).trim();
    const params: CalculatorInput = JSON.parse(inputText);

    const result = calculate(params.operation, params.num1, params.num2);

    console.log(JSON.stringify({ result }));
  } catch (error) {
    console.log(JSON.stringify({ error: error.message }));
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
