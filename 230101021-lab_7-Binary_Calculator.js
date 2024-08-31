const input = document.getElementById('input');

        function insertOperator(op) {
            if (op === 'NOT') {
                input.value = `NOT ${input.value}`;
                calculate();
            } else {
                input.value += ` ${op} `;
            }
        }

        function calculate() {
            const expression = input.value;
            let result;

            if (expression.includes('AND')) {
                const [a, b] = expression.split('AND').map(num => parseInt(num.trim(), 2));
                result = a & b;
            } else if (expression.includes('OR')) {
                const [a, b] = expression.split('OR').map(num => parseInt(num.trim(), 2));
                result = a | b;
            } else if (expression.includes('XOR')) {
                const [a, b] = expression.split('XOR').map(num => parseInt(num.trim(), 2));
                result = a ^ b;
            } else if (expression.includes('NOT')) {
                const a = parseInt(expression.replace('NOT', '').trim(), 2);
                result = ~a;
            } else if (expression.includes('<<')) {
                const [a, b] = expression.split('<<').map(num => parseInt(num.trim(), 2));
                result = a << b;
            } else if (expression.includes('>>')) {
                const [a, b] = expression.split('>>').map(num => parseInt(num.trim(), 2));
                result = a >> b;
            } else {
                return;
            }

            const binaryResult = (result >>> 0).toString(2);
            input.value = `${expression} = ${binaryResult}`;
            input.classList.add('flash');
            setTimeout(() => input.classList.remove('flash'), 500);
        }
    

















// const input = document.getElementById('input');

//         function insertOperator(op) {
//             if (op === 'NOT') {
//                 input.value = `NOT ${input.value}`;
//                 calculate();
//             } else {
//                 input.value += ` ${op} `;
//             }
//         }

//         function calculate() {
//             const expression = input.value;
//             let result;

//             if (expression.includes('AND')) {
//                 const [a, b] = expression.split('AND').map(num => parseInt(num.trim(), 2));
//                 result = a & b;
//             } else if (expression.includes('OR')) {
//                 const [a, b] = expression.split('OR').map(num => parseInt(num.trim(), 2));
//                 result = a | b;
//             } else if (expression.includes('XOR')) {
//                 const [a, b] = expression.split('XOR').map(num => parseInt(num.trim(), 2));
//                 result = a ^ b;
//             } else if (expression.includes('NOT')) {
//                 const a = parseInt(expression.replace('NOT', '').trim(), 2);
//                 result = ~a;
//             } else if (expression.includes('<<')) {
//                 const [a, b] = expression.split('<<').map(num => parseInt(num.trim(), 2));
//                 result = a << b;
//             } else if (expression.includes('>>')) {
//                 const [a, b] = expression.split('>>').map(num => parseInt(num.trim(), 2));
//                 result = a >> b;
//             } else {
//                 return;
//             }

//             const binaryResult = (result >>> 0).toString(2);
//             input.value = `${expression} = ${binaryResult}`;
//             input.classList.add('flash');
//             setTimeout(() => input.classList.remove('flash'), 500);
//         }