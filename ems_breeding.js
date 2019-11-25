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
    ems_breeding.js
    function o compute breeding combinations
    
*/

"use strict"

function uniq (arr) {
    return Array.from(
        new Set (arr) 
    );
}

function compose_gen(gen1, gen2) {
    let res = [ gen1, gen2 ].sort().join("");
    if (res[0] == "-") { // if first caracter is "-" then if must be put at the end
        return res.slice(1) + "-";
    }
    else {
        return res;
    }
};

function combine_genes ( gen_arr1, gen_arr2 ) {
    let combination = gen_arr1.map ( gen1 => 
        gen_arr2.map ( gen2 =>
            compose_gen(gen1, gen2)
        ));
    return uniq(combination.flat());
};

function genotype2Str ( genotype_arr ) {
    console.log(genotype_arr);
    return uniq(genotype_arr).sort((a, b) => 
        a.localeCompare(b, undefined, {sensitivity: 'base'})
        ).join(" ");
};

function ems_breeding(father_ems, mother_ems) {

    let father_genotype = ems_genotype_obj(father_ems, 'male');
    let mother_genotype = ems_genotype_obj(mother_ems, 'female');

    let props = [
        'basic_color',
        'diluted_color',
        'fullcolor_color',
        'silver_color',
        'modifier_aggouti',
        'modifier_siamese',
    ];

    let full_result = [];
    props.forEach(prop =>
        full_result[prop] = combine_genes(mother_genotype[prop], father_genotype[prop])
    );

    let colors = [];
    full_result.basic_color.forEach(bc =>
        full_result.diluted_color.forEach(dc =>
            full_result.fullcolor_color.forEach(fc=>
                colors.push( genotype2Str([bc, dc, fc])) 
            )
        )
    );

    let result = {
        colors:     colors,
        silver:     full_result.silver_color,
        aggouti:    full_result.modifier_aggouti,
        siamese:    full_result.modifier_siamese,
    };

    return result;
};