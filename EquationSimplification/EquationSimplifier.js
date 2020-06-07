const fs = require('fs');

function EquationSimplifier(equation_file_path) {
    const FILE_ENCODING = 'UTF-8';

    const EQUATION_ARRAY = [];

    const OP_MAPPER_DICTIONARY = {
        'add': '+',
        'subtract': '-',
        'multiply': '*',
        'divide': '/',
        'equal': '='
    };

    const OP_PRECEDENCE_DICTIONARY = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '=': 0
    };

    let pretified_equation = null;

    let transformed_equation = null;

    let file_content = null;

    try {
        file_content = JSON.parse(fs.readFileSync(equation_file_path, FILE_ENCODING));
    } catch (error) {
        console.error(error.message);
        return;
    }

    /**
     * Converts the equation object to postfix notation.
     * @param {object} equation_obj 
     */
    function convert_to_postfix(equation_obj = file_content) {
        const isLHSAnObject = (equation_obj.lhs) ? equation_obj.lhs.constructor === Object : false;
        const isRHSAnObject = (equation_obj.rhs) ? equation_obj.rhs.constructor === Object : false;

        if (isLHSAnObject) {
            convert_to_postfix(equation_obj.lhs);
        } else {
            EQUATION_ARRAY.push(equation_obj.lhs);
        }

        if (isRHSAnObject) {
            convert_to_postfix(equation_obj.rhs);
        } else {
            EQUATION_ARRAY.push(equation_obj.rhs);
        }

        EQUATION_ARRAY.push(OP_MAPPER_DICTIONARY[equation_obj.op]);
    }

    /**
     * Pretify the equation by converting from postfix to infix.
     */
    function pretify() {
        const operator_stack = [];
        let precedence = Number.MIN_SAFE_INTEGER;
        convert_to_postfix();

        EQUATION_ARRAY.forEach(elem => {
            if (Object.values(OP_MAPPER_DICTIONARY).includes(elem)) {
                const operand1 = operator_stack.pop().toString();
                const operand2 = operator_stack.pop().toString();

                let expression;
                if (precedence <= OP_PRECEDENCE_DICTIONARY[elem]) {
                    expression = "(" + operand2 + elem + operand1 + ")";
                } else {
                    expression = operand2 + elem + operand1;
                }

                operator_stack.push(expression);
                precedence = OP_PRECEDENCE_DICTIONARY[elem];

            } else {
                operator_stack.push(elem);
            }
        });

        pretified_equation = operator_stack.join();
        console.log('Pretified Equation:', pretified_equation);
        return this;
    }

    /**
     * Transform the equation by placing x at the LHS
     */
    function transform() {
        let y = 0;
        let m = 1;
        let c = 0;

        const num_stack = [];
        const operators = Object.values(OP_MAPPER_DICTIONARY);

        for (let index in EQUATION_ARRAY) {
            const element = EQUATION_ARRAY[index];

            if (operators.includes(element)) {
                switch (element) {
                    case '*':
                        const m_A = (num_stack.length > 0) ? num_stack.pop() : 1;
                        const m_B = (num_stack.length > 0) ? num_stack.pop() : 1;

                        if (m_A === 'x') {
                            m *= m_B;
                        } else {
                            m *= m_A;
                        }

                        break;

                    case '/':
                        let m_A_d = (num_stack.length > 0) ? num_stack.pop() : 1;
                        let m_B_d = (num_stack.length > 0) ? num_stack.pop() : 1;

                        if(m_A_d !== 'x' && m_B_d !== 'x') {
                            c += Math.floor(m_B_d / m_A_d);
                            break;
                        }

                        if (m_A_d === 'x') m_A_d = 1;
                        if (m_B_d === 'x') m_B_d = 1;

                        m *= eval(`${m_B_d}/${m_A_d}`);

                        break;

                    case '+':
                    case '-':
                        let c_A = (num_stack.length > 0) ? num_stack.pop() : 0;
                        let c_B = (num_stack.length > 0) ? num_stack.pop() : 0;

                        if (c_A === 'x') c_A = 0;
                        if (c_B === 'x') c_B = 0;

                        if(element === '-') {
                            c -= c_A + c_B;
                        } else {
                            c += c_A + c_B;
                        }
                        break;

                    case '=':
                        y += num_stack.pop();
                        break;
                }
            } else {
                num_stack.push(element);
            }

        }

        if(y < 0) y = `(-${Math.abs(y)})`;
        if(m < 0) m = `(-${Math.abs(m)})`;
        if(c < 0) c = `(-${Math.abs(c)})`;

        transformed_equation = `(${y}-${c})/${m}`
        console.log("Transformmed Equation:", transformed_equation);
        return this;
    }

    /**
     * Evaluate the rhs
     */
    function evaluate() {
        console.log('Evaluated x:', eval(transformed_equation));
    }

    return { pretify, transform, evaluate };
};


module.exports = EquationSimplifier;