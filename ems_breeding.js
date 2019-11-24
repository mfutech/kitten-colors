
/*
    ems_breeding.js
    
    Author: Marc Furrer, 2019

    compose possible kitten colors based parent EMS color codes
*/

"use strict"

function combine_array_uniq(arr1, arr2, join_str = "") {
    if (arr1.length == 0) return arr2;
    if (arr2.length == 0) return arr1;
    return Array.from(
        new Set(
            arr1.map(e1 =>
                arr2.map(e2 =>
                    [e1, e2]
                )
            ).flat().map(pair => pair.join(join_str))
        )
    )
};

function combine_array_sort_uniq(arr1, arr2, join_str = "") {
    if (arr1.length == 0) return arr2;
    if (arr2.length == 0) return arr1;
    return Array.from(
        new Set(
            arr1.map(e1 =>
                arr2.map(e2 =>
                    [e1, e2].sort()
                )
            ).flat().map(pair => pair.join(join_str))
        )
    )
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
        full_result[prop] = combine_array_sort_uniq(mother_genotype[prop], father_genotype[prop])
    );

    let colors = [];
    ['basic_color',
        'diluted_color',
        'fullcolor_color'].forEach(prop =>
            colors = combine_array_uniq(colors, full_result[prop], " ")
        );
    let result = {
        colors:     colors,
        silver:     full_result.silver_color,
        aggouti:    full_result.modifier_aggouti,
        siamese:    full_result.modifier_siamese,
    };
    console.log(father_genotype);
    console.log(mother_genotype);
    console.log(result)
    return result;
};