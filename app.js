
const ColorHelper = window.Color;
const Ec1 = window.getComputedStyle(document.getElementById('error1'), null).getPropertyValue('background-color');
const Ec2 = window.getComputedStyle(document.getElementById('error2'), null).getPropertyValue('background-color');
const Ec3 = window.getComputedStyle(document.getElementById('error3'), null).getPropertyValue('background-color');

const ColorError1 = ColorHelper(Ec1);
const ColorError2 = ColorHelper(Ec2);
const ColorError3 = ColorHelper(Ec3);


const ColorSuperset = (id)  => {
    const input = document.getElementById(id);
    const render = document.getElementById(`${id}Render`);
    const text = document.getElementById(`${id}Text`);

    const hue = document.getElementById(`${id}Hue`);
    const saturation = document.getElementById(`${id}Saturation`);
    const lightness = document.getElementById(`${id}Lightness`);

    const rgb = document.getElementById(`${id}RBG`);
    const hsl = document.getElementById(`${id}HSL`);
    const hex = document.getElementById(`${id}HEX`);

    const whiteness = document.getElementById(`${id}Whiteness`);

    return {
        input,
        render,
        text,
        hue,
        saturation,
        lightness,
        rgb,
        hsl,
        hex,
        whiteness,
    };
};

const calculateStep = (step, baseColor) => {
    const stepElement = ColorSuperset(step);
    const { hue, saturation, lightness, render, text, whiteness } = stepElement;
    let color = ColorHelper(baseColor);
    const HSL = color.hsl().round();
    HSL.color[0] = HSL.color[0] + Number(hue.value);
    HSL.color[1] = HSL.color[1] * Number(saturation.value / 100);
    HSL.color[2] = HSL.color[2] * Number(lightness.value / 100);
    color = HSL.mix(ColorHelper('white'), whiteness.value / 100);
    text.value = color.hsl().round();
    render.style = `background-color: ${color.hsl()}`;

    const contrast1 = ColorHelper(baseColor).contrast(ColorError1)
    let error = ColorHelper('transparent'); 

    if(contrast1 > 2) {
        error = ColorError1;
    } else if(ColorHelper(baseColor).contrast(ColorError2) > 2) {
        error = ColorError2;
    } else {
        error = ColorError3;
    }
    document.getElementById('baseColorError').style= `background-color: ${error.hex()}`
    

    return { ...stepElement, color };
};

const createListenerCallback = ({input, render, text, hex, rgb, hsl }, inverse) =>  {
    const element = inverse ? text : input;
    const inverseElement = inverse ? input : text;
    const colorBase = ColorHelper(element.value);
    render.style = `background-color: ${colorBase.hsl().round()}`;
    inverseElement.value = colorBase.hsl().round();
    hex.value = colorBase.hex();
    rgb.value = colorBase.rgb();
    hsl.value = colorBase.hsl().round();
    return colorBase;
};

function init () {

    console.log(ColorError1);

    const baseColorElements = ColorSuperset('baseColor');
    const { text, input } = baseColorElements;
    const steps = ['stepColor1', 'stepColor2', 'stepColor3'];

    text.addEventListener('change', () => {
        const baseColor = createListenerCallback(baseColorElements, true);
        steps.map((stepColor) => {
            calculateStep(stepColor, baseColor);
        });
    });

    input.addEventListener('change', () => {
        const baseColor = createListenerCallback(baseColorElements);
        steps.map((stepColor) => {
            calculateStep(stepColor, baseColor);
        });
    });

    text.value = 'hsl(217,100%,19%)'; 
    const initColor = createListenerCallback(baseColorElements, true);
    steps.map((stepColor) => {
        const steps = calculateStep(stepColor, initColor);
        const { hue, saturation, lightness, whiteness } = steps;
        whiteness.addEventListener('change', () => {
            const baseColor = baseColorElements.text.value;
            calculateStep(stepColor, baseColor);
        });
        hue.addEventListener('change', () => {
            const baseColor = baseColorElements.text.value;
            calculateStep(stepColor, baseColor);
        });
        saturation.addEventListener('change', () => {
            const baseColor = baseColorElements.text.value;
            calculateStep(stepColor, baseColor);
        });
        lightness.addEventListener('change', () => {
            const baseColor = baseColorElements.text.value;
            calculateStep(stepColor, baseColor);
        });
    });

    
}



init();
