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

class CatColor{

    constructor(base, dilution, fullcolor){
        this.base = base;
        this.dilution = dilution;
        this.fullcolor = fullcolor;
        this.genotype = genotype2Str([this.base, this.dilution, this.fullcolor]);
        this.diluted = (dilution == 'dd');
        this.cinamon = (fullcolor = 'blbl');
        this.sex = (base.slice(-1) == "y" ? "male" : "femelle");
        let c = [ this.fullcolor, this.dilution, this.base].join(" ");
        let res;
        //console.log(c);
        if (c.match(/B. D. o[oy]/))          res = ["black",    "n"];
        else if (c.match(/B. dd o[oy]/))     res = ["blue",     "a"];
        else if (c.match(/blbl D. o[oy]/))   res = ["cinnamon", "o"];
        else if (c.match(/blbl dd o[oy]/))   res = ["fawn",     "p"];
        else if (c.match(/[bl/]+ dd o[oy]/)) res = ["lilac",    "c"];
        else if (c.match(/B. D. O[Oy]/))     res = ["red",      "d"];
        else if (c.match(/b. D. O[Oy]/))     res = ["red",      "d"];
        else if (c.match(/blbl D. O[Oy]/))   res = ["red",      "d"];
        else if (c.match(/B. dd O[Oy]/))     res = ["cream",    "e"];
        else if (c.match(/b. dd O[Oy]/))     res = ["cream",    "e"];
        else if (c.match(/blbl dd O[Oy]/))   res = ["cream",    "e"];
        else if (c.match(/-- dd o[oy]/))     res = ["blue(fawn?)", "a/p?"];
        else if (c.match(/B. D. Oo/))        res = ["black tortie", "f"];
        else if (c.match(/B. dd Oo/))        res = ["chocolatetortie", "h"];
        else if (c.match(/bbl? D. Oo/))      res = ["lilactortie", "j"];
        else if (c.match(/blbl dd Oo/))      res = ["cinnamontortie", "q"];
        else if (c.match(/-- D. o[oy]/))     res = ["black(cinnamon?)", "n/o?"];
        else if (c.match(/B. -- o[oy]/))     res = ["black(blue?)", "n/a?"];
        else if (c.match(/-- -- o[oy]/))     res = ["black ???", "n??"];
        else res = ["???", "?"];

        //console.log(res);
        this.color = res[0];
        this.color_ems = res[1];
        this.text = this.sex + " " + this.color + " (" + this.color_ems + ")";
    };
};

class CatSilver {
    constructor(silver){
        this.silver = silver;
        this.genotype = silver
        switch (silver) {
            case 'ii': 
                this.text = "non-silver"; break;
            case "i-":
                this.text = "non-silver?"; break;
            default:
                this.text = "silver";
        };
    };
};

class CatAggouti {
    constructor (aggouti) {
        this.aggouti = aggouti;
        this.genotype = aggouti; 
        switch (aggouti) {
            case "aa":
               this.text = "solid"; break;
            case "a-":
                this.text = "solid?"; break;
            case "Aa":
                this.text = "aggouti (porteur solid)"; break;
            default:
                this.text = "aggouti";
        };
    }
};

class CatPoint {
    constructor (point) {
        this.point = point;
        this.genotype = point;
        switch(point) {
            case "cscs":
                this.text = "point"; break;
            case "Cscs":
                this.text = "classic (porteur point)"; break;
            case "cs-":
                this.text = "point ?"; break;
            default:
                this.text = "classic";
        };
    };

};

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
    // console.log(genotype_arr);
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
                colors.push( new CatColor(bc, dc, fc)) 
            )
        )
    );

    let result = {
        colors:     colors,
        silver:     full_result.silver_color.map(c => new CatSilver(c)),
        aggouti:    full_result.modifier_aggouti.map(c => new CatAggouti(c)),
        siamese:    full_result.modifier_siamese.map(c => new CatPoint(c)),
    };

    return result;
};