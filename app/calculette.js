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
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import 'bootstrap';
require('bootstrap/dist/css/bootstrap.min.css');
import Vue from 'vue';

import { ems_translate } from './ems_translator.js';
import { ems_genotype, parse_genotype, ems_genotype_obj, ems_genotype_obj_to_str } from './ems_genotype.js';
import { ems_breeding_genotype } from './ems_breeding';

Vue.filter("formatPercent", function (number) {
  if (isNaN(number)) 
    return "";
  else
    return new Intl.NumberFormat('de-DE', { style: 'percent', minimumFractionDigits: 2,
    maximumFractionDigits: 2 }).format(number);
});


var breeding = new Vue({
  el: '#Breeding',
  data: {
    sire_color: "n",
    sire_silver_flag: false,
    sire_aggouti_flag: false,
    sire_choco_holder_flag: false,
    sire_cinnamon_holder_flag: false,
    sire_dilution_holder_flag: false,
    sire_hz_aggouti_flag: false,
    sire_hz_silver_flag: false,
    sire_siamese_flag: true,
    sire_color_obj: {},
    dam_color: "n",
    dam_silver_flag: false,
    dam_aggouti_flag: false,
    dam_choco_holder_flag: false,
    dam_cinnamon_holder_flag: false,
    dam_dilution_holder_flag: false,
    dam_hz_aggouti_flag: false,
    dam_hz_silver_flag: false,
    dam_siamese_flag: true,
    dam_color_obj: {},
    kitten_colors: [],
    kitten_female_color_count: {},
    kitten_male_color_count: {},
    currentSort: 'color',
    currentSortDir: 'asc'
  },
  beforeMount: function () {
    this.do_breeding();
  },
  methods: {
    do_breeding: function () {
      if (this.sire_color_obj.basic_color != undefined && this.dam_color_obj.basic_color != undefined) {
        this.kitten_colors = ems_breeding_genotype(this.sire_color_obj, this.dam_color_obj);
        let kitten_male_color_count = [];
        let kitten_female_color_count = []
        this.kitten_colors.colors.forEach(color => {
          if (color.sex == 'male') {
            kitten_male_color_count[color.color_ems] =
              (kitten_male_color_count[color.color_ems] ? kitten_male_color_count[color.color_ems] : 0) + 1;
          } else {
            kitten_female_color_count[color.color_ems] =
              (kitten_female_color_count[color.color_ems] ? kitten_female_color_count[color.color_ems] : 0) + 1;
          };
        });
        this.kitten_male_color_count   = kitten_male_color_count;
        this.kitten_female_color_count = kitten_female_color_count
      };
    },
    pcent_color: function (color, sex) {
      if (this.kitten_colors.collection == undefined) return "--";
      if (sex == 'male') {
        let res = this.kitten_male_color_count[color];
        if ( res != undefined)
          return  res / this.kitten_colors.collection.length;
        else 
          return "-";
      }
      else {
        let res = this.kitten_female_color_count[color]
        if (res != undefined)
          return res / this.kitten_colors.collection.length;
        else 
          return "-";
      };
    }
  },
  computed: {
    sire_ems_color: function () {
      let color = ems_genotype_obj(this.sire_color, 'male');
      color.modifier_siamese = ['cs', 'cs'];
      if (this.sire_aggouti_flag) {
        if (this.sire_hz_aggouti_flag)
          color.modifier_aggouti = ['A', 'A'];
        else
          color.modifier_aggouti = ['A', '-'];
      } else {
        color.modifier_aggouti = ['a', 'a'];
      };
      if (this.sire_silver_flag) {
        if (this.sire_hz_silver_flag)
          color.silver_color = ['I', 'I'];
        else
          color.silver_color = ['I', '-'];
      } else {
        color.silver_color = ['i', 'i'];
      };
      if (this.sire_choco_holder_flag)
        color.fullcolor_color[1] = 'b';
      if (this.sire_cinnamon_holder_flag)
        color.fullcolor_color[1] = 'bl';
      if (this.sire_dilution_holder_flag)
        color.diluted_color[1] = 'd';
      this.sire_color_obj = color;

      return ems_genotype_obj_to_str(color);
    },
    dam_ems_color: function () {
      let color = ems_genotype_obj(this.dam_color, 'female');
      color.modifier_siamese = ['cs', 'cs'];
      if (this.dam_aggouti_flag) {
        if (this.dam_hz_aggouti_flag)
          color.modifier_aggouti = ['A', 'A'];
        else
          color.modifier_aggouti = ['A', '-'];
      } else {
        color.modifier_aggouti = ['a', 'a'];
      };
      if (this.dam_silver_flag) {
        if (this.dam_hz_silver_flag)
          color.silver_color = ['I', 'I'];
        else
          color.silver_color = ['I', '-'];
      } else {
        color.silver_color = ['i', 'i'];
      };
      if (this.dam_choco_holder_flag)
        color.fullcolor_color[1] = 'b';
      if (this.dam_cinnamon_holder_flag)
        color.fullcolor_color[1] = 'bl';
      if (this.dam_dilution_holder_flag)
        color.diluted_color[1] = 'd';
      this.dam_color_obj = color;

      return ems_genotype_obj_to_str(color);
    },
  },
  watch: {
    // whenever question changes, this function will run
    'sire_ems_color': function (newval, oldval) {
      if (newval != oldval) {
        this.do_breeding();
      };
    },
    'dam_ems_color': function (newval, oldval) {
      if (newval != oldval) {
        this.do_breeding();
      };
    }
  }
});

