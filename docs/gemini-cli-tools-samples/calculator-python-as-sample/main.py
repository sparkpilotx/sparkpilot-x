import json
import sys

def calculate(operation: str, num1: float, num2: float) -> float:
    """Perform basic mathematical calculations."""
    if operation == 'add':
        return num1 + num2
    elif operation == 'subtract':
        return num1 - num2
    elif operation == 'multiply':
        return num1 * num2
    elif operation == 'divide':
        if num2 == 0:
            raise ValueError("Cannot divide by zero")
        return num1 / num2
    else:
        raise ValueError(f"Unknown operation: {operation}")

def main():
    """Main function that reads JSON from stdin and returns result to stdout."""
    try:
        # Read JSON input from stdin
        input_data = sys.stdin.read().strip()
        params = json.loads(input_data)
        
        # Extract parameters
        operation = params['operation']
        num1 = params['num1']
        num2 = params['num2']
        
        # Calculate result
        result = calculate(operation, num1, num2)
        
        # Output result as JSON
        print(json.dumps({"result": result}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()