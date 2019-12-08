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


class CatColor {

    constructor(base, dilution, fullcolor, silver, aggouti, siamese) {
        this.base = base;
        this.dilution = dilution;
        this.fullcolor = fullcolor;
        this.is_diluted = (dilution == 'dd');
        this.is_chocolate = (fullcolor.match(/^B/) == null && fullcolor != "--");
        this.is_cinamon = (fullcolor == 'blbl');
        this.sex = (base.slice(-1) == "y" ? "male" : "femelle");

        // other color calculator
        let color = "";
        let ems = "";
        switch (this.base) {
            case "oo": //black female
            case "oy": //black male
                if (this.is_diluted) { // dd
                    if (this.is_chocolate) { // blb bbl
                        if (this.is_cinamon) { // blbl
                            color = "fawn";
                            ems = "p";
                        }
                        else {
                            color = "lilac";
                            ems = "c";
                        }
                    }
                    else { // BB Bb
                        color = "blue";
                        ems = "a";
                    }
                }
                else { // DD Dd
                    if (this.is_chocolate) { // blb bbl
                        if (this.is_cinamon) { // blbl
                            color = "cinnamon";
                            ems = "o";
                        }
                        else {
                            color = "chocolate";
                            ems = "b";
                        }
                    }
                    else { // Bb B-
                        color = "black";
                        ems = "n";
                    }
                }
                break;
            case "OO":
            case "Oy":
                if (this.is_diluted) {
                    color = "cream";
                    ems = "e";
                }
                else {
                    color = "red";
                    ems = "d";
                }
                break;
            case "Oo": // tortie
                if (this.is_diluted) { // dd
                    if (this.is_chocolate) { // blb bbl
                        if (this.is_cinamon) { // blbl
                            color = "fawntortie";
                            ems = "r";
                        }
                        else {
                            color = "lilactortie";
                            ems = "j";
                        }
                    }
                    else { // BB Bb
                        color = "bluetortie";
                        ems = "g";
                    }
                }
                else { // DD Dd
                    if (this.is_chocolate) { // blb bbl
                        if (this.is_cinamon) { // blbl
                            color = "cinnamontortie";
                            ems = "q";
                        }
                        else {
                            color = "chocolatetortie";
                            ems = "h";
                        }
                    }
                    else { // Bb B-
                        color = "blacktortie";
                        ems = "f";
                    }
                }
                break;
            default:
                color = "IMPOSSIBLE";
                ems = "?";
        };

        // add comment
        let comments = [];
        if (dilution == "Dd" ||
            dilution == "d-") comments.push("porteur de dilution");
        if (dilution == "--") comments.push("dilution indéterminée");
        if (fullcolor == "Bb" ||
            fullcolor == "b-") comments.push("porteur de chocolat");
        if (fullcolor == "Bbl" ||
            fullcolor == "bl-") comments.push("porteur de cinamon");
        if (fullcolor == "Bb/bl" ||
            fullcolor == "b/bl-") comments.push("porteur cinamon ou chocolat");
        if (fullcolor == "--") comments.push("chocolat/cinamon indéterminé");
        //comments.push("fullcolor: "+fullcolor);

        //console.log(res);
        this.color = color;
        this.color_ems = ems;
        this.text = this.sex + " " + this.color;
        this.comments = comments;

        // take care of silver
        this.silver = silver;
        this.is_silver = (silver.match(/I[Ii-]/) != null);
        if (this.is_silver) {
            this.color_ems += "s";
            this.color += " silver";
        }

        // take care of siamese
        this.is_siamese = false;
        this.siamese = siamese;
        switch (siamese) {
            case "cscs":
                this.is_siamese = true;
                this.color += " point";
                this.color_ems += " 33";
                break;
            case "Cscs":
            case "cs-":
                this.comments.push("porteur point"); break;
            case "--":
                this.comments.push("point indéterminé"); break;
        };

        // take care of aggouti
        this.aggouti = aggouti;
        if (aggouti.match(/A[Aa-]/) != null) {
            this.is_aggouti = true;
            this.color += " aggouti";
            this.color_ems += " 21";
        }
        else if (aggouti.match(/Aa|a-/)) {
            this.comments.push("porteur solid");
        }
        else if (aggouti == "--") {
            this.comments.push("aggouti indéterminé");
        }

        this.is_solid = (aggouti == "aa");


        // fix genotype
        this.genotype = genotype2Str([this.base, this.dilution, this.fullcolor, this.silver, this.aggouti, this.siamese]);

    };
};

class CatColorCollection {
    constructor() {
        this.colors = {};
        this.keys = new Set();
        this.counters = {};
        this.length = 0
    };

    add(cat_color) {
        // cat_color: CatColor
        let key = cat_color.sex + " " + cat_color.color;
        if (this.colors[key]) {
            this.colors[key].push(cat_color);
        }
        else {
            this.colors[key] = [cat_color];
        };
        this.keys.add(key);
        this.counters[key] = (this.counters[key] ? this.counters[key] : 0) + 1;
        this.length += 1;
    };
    as_array() {
        let res = [];
        this.keys.forEach(key =>
            this.colors[key].forEach(color =>
                res.push(color)));
        return res;
    }
};

function compose_gen(gen1, gen2) {
    let res = [gen1, gen2].sort().join("");
    if (res[0] == "-") { // if first caracter is "-" then if must be put at the end
        return res.slice(1) + "-";
    }
    else {
        return res;
    }
};

function combine_genes(gen_arr1, gen_arr2) {
    let combination = gen_arr1.map(gen1 =>
        gen_arr2.map(gen2 =>
            compose_gen(gen1, gen2)
        ));
    return uniq(combination.flat());
};

function genotype2Str(genotype_arr) {
    console.log(genotype_arr);
    return uniq(genotype_arr).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
    ).join(" ");
};


function ems_breeding_genotype(father_genotype, mother_genotype) {

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

    let color_collection = new CatColorCollection();
    full_result.basic_color.forEach(bc =>
        full_result.diluted_color.forEach(dc =>
            full_result.fullcolor_color.forEach(fc =>
                full_result.silver_color.forEach(sc =>
                    full_result.modifier_aggouti.forEach(am =>
                        full_result.modifier_siamese.forEach(sm =>
                            color_collection.add(new CatColor(bc, dc, fc, sc, am, sm))
                        )
                    )
                )
            )
        )
    );

    let result = {
        colors: color_collection.as_array(),
        collection: color_collection,
    };

    return result;
};