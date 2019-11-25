/** Kitten Genotype Calculator
    Copyright (C) 2019 Marc Furrer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
**/
/*
    ems_genotype.js
    
    Author: Marc Furrer, 2019

    This package tries de translate a Phenotype, expressed using an EMS color code into
    a Genotype.
    Only relevant for cats, from common breeds.
*/

"use strict"

function basic_color(ems_color, sex) {
    // ems color, as a string
    if (ems_color.match(/d|e/)) {
        // its a red
        return ["O", (sex == 'male' ? "y" : "O")];
    }
    else if (ems_color.match(/f|g|h|j|q|r/)) {
        // its a tortie
        return ["O", "o"];
    }
    else {
        return ["o", (sex == 'male' ? "y" : "o")]; // black is the only color left :-)
    };
};

function diluted_color(ems_color) {
    // ems color, as a string
    if (ems_color.match(/a|c|e|g|j|r/)) {
        return ["d", "d"]; // diluted
    }
    else {
        return ["D", "-"]; // not diluted
    };
};

function fullcolor_color(ems_color) {
    // ems color as a string
    if (ems_color.match(/b|c|h|j/)) {
        return ["b", "b/bl"];
    }
    else if (ems_color.match(/o|p|q|r/)) {
        return ["bl", "bl"];
    }
    else {
        return ["B", "-"];
    };
};

function silver_color(ems_color) {
    if (ems_color.match(/s/)) {
        return ["I", "-"];
    }
    else {
        return ["i", "i"];
    }
};

function modifier_aggouti(ems_modifiers) {
    // modifiers as arrays
    if (ems_modifiers.includes('21')) {
        return ["A", "-"];
    }
    else if (ems_modifiers.includes('22')) {
        return ["A", "-"];
    }
    else if (ems_modifiers.includes('23')) {
        return ["A", "-"];
    }
    else if (ems_modifiers.includes('24')) {
        return ["A", "-"];
    }
    else if (ems_modifiers.includes('25')) {
        return ["A", "-"];
    }
    else {
        return ["a", "a"];
    }
}

function modifier_siamese(ems_modifiers) {
    if (ems_modifiers.includes('33')) {
        return ["cs", "cs"];
    }
    else {
        return ["Cs", "-"];
    }
};

function ems_genotype_obj(ems_code, sex) {
    let ems = ems_parse(ems_code);
    let genotype = {
        basic_color: basic_color(ems.color, sex),
        diluted_color: diluted_color(ems.color),
        fullcolor_color: fullcolor_color(ems.color),
        silver_color: silver_color(ems.color),
        modifier_aggouti: modifier_aggouti(ems.patterns),
        modifier_siamese: modifier_siamese(ems.patterns),
    };
    return genotype;
};

function ems_genotype(ems_code, sex = 'male') {
    let genotype = ems_genotype_obj(ems_code, sex);

    let props = [
        'basic_color',
        'diluted_color',
        'fullcolor_color',
        'silver_color',
        'modifier_aggouti',
        'modifier_siamese',
    ];

    return props.map(function (p) {
        return genotype[p].join("")
    }).sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})).join(" ");
};

function translate_genotype_color (genotype){
    
}