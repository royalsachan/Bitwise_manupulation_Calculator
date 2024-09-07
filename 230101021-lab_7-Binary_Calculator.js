document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.buttons button');
    const modeInputs = document.querySelectorAll('input[name="mode"]');
    let currentMode = 'binary';
    let history = [];
    let currentIndex = -1;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('digit')) {
                display.value += button.dataset.value;
            } else if (button.classList.contains('operator')) {
                handleOperator(button.dataset.op);
            } else if (button.classList.contains('action')) {
                handleAction(button.dataset.action);
            }
        });
    });

    modeInputs.forEach(input => {
        input.addEventListener('change', () => {
            currentMode = input.id;
        });
    });

    function handleOperator(operator) {
        switch (operator) {
            case '=':
                calculate();
                break;
            case 'AND':
                display.value += ' ∧ '; // AND symbol
                break;
            case 'OR':
                display.value += ' ∨ '; // OR symbol
                break;
            case 'XOR':
                display.value += ' ⊕ '; // XOR symbol
                break;
            case 'NOT':
                display.value = `¬${display.value}`; // NOT symbol
                break;
            case '<<':
                display.value += ' << ';
                break;
            case '>>':
                display.value += ' >> ';
                break;
            case '>>>':
                display.value += ' >>> ';
                break;
            case "1'sComp":
                display.value = `1'sC(${display.value})`; // 1's Complement notation
                break;
            case "2'sComp":
                display.value = `2'sC(${display.value})`; // 2's Complement notation
                break;
            case '*':
                display.value += ' * ';
                break;
            case '/':
                display.value += ' / ';
                break;
        }
    }

    function handleAction(action) {
        switch (action) {
            case 'delete':
                display.value = display.value.slice(0, -1);
                break;
            case 'reset':
                display.value = '';
                history = [];
                currentIndex = -1;
                break;
            case 'prev':
                if (currentIndex > 0) {
                    currentIndex--;
                    display.value = history[currentIndex];
                }
                break;
            case 'next':
                if (currentIndex < history.length - 1) {
                    currentIndex++;
                    display.value = history[currentIndex];
                }
                break;
            case 'first':
                if (history.length > 0) {
                    currentIndex = 0;
                    display.value = history[currentIndex];
                }
                break;
            case 'last':
                if (history.length > 0) {
                    currentIndex = history.length - 1;
                    display.value = history[currentIndex];
                }
                break;
        }
    }

    function calculate() {
        const expression = display.value;
        let result;
        let steps = [];

        try {
            if (expression.includes('∧')) {
                const [a, b] = expression.split('∧').map(num => parseInt(num.trim(), 2));
                result = a & b;
                steps = explainAND(a, b);
            } else if (expression.includes('∨')) {
                const [a, b] = expression.split('∨').map(num => parseInt(num.trim(), 2));
                result = a | b;
                steps = explainOR(a, b);
            } else if (expression.includes('⊕')) {
                const [a, b] = expression.split('⊕').map(num => parseInt(num.trim(), 2));
                result = a ^ b;
                steps = explainXOR(a, b);
            } else if (expression.startsWith('¬')) {
                const a = parseInt(expression.replace('¬', '').trim(), 2);
                result = ~a & 0xFFFFFFFF; // Ensure 32-bit result
                steps = explainNOT(a);
            } else if (expression.startsWith("1'sC(")) {
                const binary = expression.slice(5, -1);
                result = parseInt(calculateOnesComplement(binary), 2);
                steps = explainOnesComplement(binary);
            } else if (expression.startsWith("2'sC(")) {
                const binary = expression.slice(5, -1);
                result = parseInt(calculateTwosComplement(binary), 2);
                steps = explainTwosComplement(binary);
            } else if (expression.includes('<<')) {
                const [a, b] = expression.split('<<').map(num => parseInt(num.trim(), 2));
                result = a << b;
            } else if (expression.includes('>>')) {
                const [a, b] = expression.split('>>').map(num => parseInt(num.trim(), 2));
                result = a >> b;
            } else if (expression.includes('>>>')) {
                const [a, b] = expression.split('>>>').map(num => parseInt(num.trim(), 2));
                result = a >>> b;
            } else if (expression.includes('*')) {
                const [a, b] = expression.split('*').map(num => parseInt(num.trim(), 2));
                result = a * b;
            } else if (expression.includes('/')) {
                const [a, b] = expression.split('/').map(num => parseInt(num.trim(), 2));
                result = Math.floor(a / b);
            } else {
                throw new Error('Invalid expression');
            }

            result = formatResult(result);
            display.value = result;
            
            // Add the result to history
            history.push(result);
            currentIndex = history.length - 1;

            // Store steps for stepwise explanation
            localStorage.setItem('steps', JSON.stringify(steps));
        } catch (error) {
            display.value = 'Error';
            localStorage.removeItem('steps');
        }
    }

    function calculateOnesComplement(binary) {
        return binary.split('').map(bit => bit === '0' ? '1' : '0').join('');
    }

    function calculateTwosComplement(binary) {
        let onesComplement = calculateOnesComplement(binary);
        let carry = 1;
        let result = '';
        for (let i = onesComplement.length - 1; i >= 0; i--) {
            if (onesComplement[i] === '1' && carry === 1) {
                result = '0' + result;
            } else if (onesComplement[i] === '0' && carry === 1) {
                result = '1' + result;
                carry = 0;
            } else {
                result = onesComplement[i] + result;
            }
        }
        return result;
    }

    function formatResult(result) {
        switch (currentMode) {
            case 'binary':
                return (result >>> 0).toString(2);
            case 'octal':
                return (result >>> 0).toString(8);
            case 'both':
                return `${(result >>> 0).toString(2)} (${result})`;
            default:
                return (result >>> 0).toString(2);
        }
    }

    function explainAND(a, b) {
        return [
            `Step 1: Convert ${a} and ${b} to binary`,
            `A: ${a.toString(2).padStart(8, '0')}`,
            `B: ${b.toString(2).padStart(8, '0')}`,
            `Step 2: Perform bitwise AND operation`,
            `Result: ${(a & b).toString(2).padStart(8, '0')}`
        ];
    }

    function explainOR(a, b) {
        return [
            `Step 1: Convert ${a} and ${b} to binary`,
            `A: ${a.toString(2).padStart(8, '0')}`,
            `B: ${b.toString(2).padStart(8, '0')}`,
            `Step 2: Perform bitwise OR operation`,
            `Result: ${(a | b).toString(2).padStart(8, '0')}`
        ];
    }

    function explainXOR(a, b) {
        return [
            `Step 1: Convert ${a} and ${b} to binary`,
            `A: ${a.toString(2).padStart(8, '0')}`,
            `B: ${b.toString(2).padStart(8, '0')}`,
            `Step 2: Perform bitwise XOR operation`,
            `Result: ${(a ^ b).toString(2).padStart(8, '0')}`
        ];
    }

    function explainNOT(a) {
        return [
            `Step 1: Convert ${a} to binary`,
            `A: ${a.toString(2).padStart(8, '0')}`,
            `Step 2: Perform bitwise NOT operation`,
            `Result: ${((~a) & 0xFF).toString(2).padStart(8, '0')}`
        ];
    }

    function explainOnesComplement(binary) {
        return [
            `Step 1: Original binary: ${binary}`,
            `Step 2: Flip all bits`,
            `Result: ${calculateOnesComplement(binary)}`
        ];
    }

    function explainTwosComplement(binary) {
        const onesComp = calculateOnesComplement(binary);
        const twosComp = calculateTwosComplement(binary);
        return [
            `Step 1: Original binary: ${binary}`,
            `Step 2: Calculate 1's complement: ${onesComp}`,
            `Step 3: Add 1 to 1's complement`,
            `Result: ${twosComp}`
        ];
    }

    document.getElementById('stepwise').addEventListener('click', () => {
        const steps = JSON.parse(localStorage.getItem('steps'));
        if (steps) {
            alert(steps.join('\n\n'));
        } else {
            alert('No steps available. Please perform a calculation first.');
        }
    });
});
