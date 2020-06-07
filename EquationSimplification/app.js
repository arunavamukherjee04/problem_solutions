const path = require('path');
const EquationSimplifier = require('./EquationSimplifier');

try {
    const simplifier = new EquationSimplifier(path.join(__dirname, './equation.json'));
    simplifier
    .pretify().transform().evaluate();  
} catch (error) {
    console.error(error.message);
}
