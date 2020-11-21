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

import { CatColor } from './cat_color';
import { ems_parse } from './ems_translator';
export { ems_genotype, parse_genotype, ems_genotype_obj, ems_genotype_obj_to_str, catcol_from_genotype_str };

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

function diluted_genes(ems_color) {
    // ems color, as a string
    if (ems_color.match(/a|c|e|g|j|r/)) {
        return ["d", "d"]; // diluted
    }
    else {
        return ["D", "-"]; // not diluted
    };
};

function fullcolor_genes(ems_color) {
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

function silver_genes(ems_color) {
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
        diluted_color: diluted_genes(ems.color),
        fullcolor_color: fullcolor_genes(ems.color),
        silver_color: silver_genes(ems.color),
        modifier_aggouti: modifier_aggouti(ems.patterns),
        modifier_siamese: modifier_siamese(ems.patterns),
    };
    return genotype;
};

function ems_genotype_obj_to_str(ems_code_obj) {
    let props = [
        'basic_color',
        'diluted_color',
        'fullcolor_color',
        'silver_color',
        'modifier_aggouti',
        'modifier_siamese',
    ];

    return props.map(function (p) {
        return ems_code_obj[p].join("")
    }).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join(" ");

}

function ems_genotype(ems_code, sex = 'male') {
    if (ems_code == "") return "";
    let genotype = ems_genotype_obj(ems_code, sex);
    return ems_genotype_obj_to_str(genotype);
};

function update_error(error, genes_ar, max_length) {
    if (genes_ar.length > max_length) {
        error.push(genes_ar.slice(2).join(""));
    }
    return error;
};

function parse_genotype(genes_str) {
    let genes = genes_str.split(/\s+/);
    let color = {
        basic_color: ["-", "-"],
        diluted_color: ["-", "-"],
        fullcolor_color: ["-", "-"],
        silver_color: ["-", "-"],
        modifier_aggouti: ["-", "-"],
        modifier_siamese: ["-", "-"],
        genes_error: []
    };
    let m;

    genes.forEach(function (gene) {
        if (m = gene.match(/^(a)(a|-)$/i)) { // aggouti
            color.modifier_aggouti = [m[1], m[2]];
        }
        else if (m = gene.match(/^(d)(d|-)$/i)) { //diluted
            color.diluted_color = [m[1], m[2]];
        }
        else if (m = gene.match(/^(o)(o|y)$/i)) { // color & sex
            color.basic_color = [m[1], m[2]];
        }
        else if (m = gene.match(/^(i)(i|-)$/i)) { // silver
            color.silver_color = [m[1], m[2]];
        }
        else if (m = gene.match(/^(cs)(cs|-)$/i)) { // point
            color.modifier_siamese = [m[1], m[2]];
        }
        else if (m = gene.match(/^(b|bl|b\/bl)(b|bl|b\/bl|-)$/i)) { //fullcolor
            color.fullcolor_color = [m[1], m[2]];
        }
        else if (gene == "--") { // discard unknown
        }
        else {
            color.genes_error.push(gene);
        }
    });
    return color;
};

function catcol_from_genotype_str(genotype_str) {
    let col = parse_genotype(genotype_str);
    let catcol = new CatColor(
        col.basic_color.join(""), col.diluted_color.join(""), col.fullcolor_color.join(""),
        col.silver_color.join(""), col.modifier_aggouti.join(""), col.modifier_siamese.join("")
    );
    return catcol;
};