/*
    ems_genotype.js
    
    Author: Marc Furrer, 2019

    This package tries de translate a Phenotype, expressed using an EMS color code into
    a Genotype.
    Only relevant for cats, from common breeds.
*/


function basic_color (ems_color) {
    // ems color, as a string
    if (ems_color.match(/d|e/)) {
        // its a red
        return "O-";
    }
    else if (ems_color.match(/f|g|h|j|q|r/)) {
        // its a tortie
        return "Oo";
    }
    else {
        return "o-"; // black is the only color left :-)
    };
};

function diluted_color (ems_color) {
    // ems color, as a string
    if (ems_color.match(/a|c|e|g|j|r/)) {
        return "dd"; // diluted
    }
    else {
        return "D-"; // not diluted
    };
};

function fullcolor_color (ems_color) {
    // ems color as a string
    if (ems_color.match(/b|c|h|j/)){
        return "bb/bbl";
    }
    else if (ems_color.match(/o|p|q|r/)) {
        return "blbl";
    }
    else {
        return "B-";
    };
};

function silver_color (ems_color) {
    if (ems_color.match(/s/)) {
        return "I-";
    } 
    else {
        return "ii";
    }
};

function modifier_aggouti (ems_modifiers) {
    // modifiers as arrays
    if (ems_modifiers.includes('21')) {
        return "A-";
    }
    else if (ems_modifiers.includes('22')) {
        return "A-";
    }
    else if (ems_modifiers.includes('23')) {
        return "A-";
    }
    else if (ems_modifiers.includes('24')) {
        return "A-";
    }
    else if (ems_modifiers.includes('25')) {
        return "A-";
    }
    else{
        return "aa";
    }
}

function mofifier_siamese (ems_modifiers) {
    if (ems_modifiers.includes('33')) {
        return "cscs";
    }
    else {
        return "Cs--";
    }
};

function ems_genotype (ems_code) {
    ems = ems_parse (ems_code);
    genotype = [];
    genotype.push(basic_color(ems.color));
    genotype.push(diluted_color(ems.color));
    genotype.push(fullcolor_color(ems.color));
    genotype.push(silver_color(ems.color));
    genotype.push(modifier_aggouti(ems.patterns));
    genotype.push(mofifier_siamese(ems.patterns));
    return genotype.join(" ");
}