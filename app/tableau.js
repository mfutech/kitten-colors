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
import VueRouter from 'vue-router';

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

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  
});

var breeding = new Vue({
  router,
  el: '#Breeding',
  data: {
    sire: {
      color: "n",
      silver_flag: false,
      aggouti_flag: false,
      choco_holder_flag: false,
      cinnamon_holder_flag: false,
      dilution_holder_flag: false,
      hz_aggouti_flag: false,
      hz_silver_flag: false,
      siamese_flag: true,
      color_obj: {},
      point_flag: false,
      point_holder_flag: false
    },
    dam: {
      color: "n",
      silver_flag: false,
      aggouti_flag: false,
      choco_holder_flag: false,
      cinnamon_holder_flag: false,
      dilution_holder_flag: false,
      hz_aggouti_flag: false,
      hz_silver_flag: false,
      siamese_flag: true,
      color_obj: {},
      point_flag: false,
      point_holder_flag: false
    },
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
      if (this.sire.color_obj.basic_color != undefined && this.dam.color_obj.basic_color != undefined) {
        this.kitten_colors = ems_breeding_genotype(this.sire.color_obj, this.dam.color_obj);
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
      let color = ems_genotype_obj(this.sire.color, 'male');

      if (this.sire.aggouti_flag) {
        if (this.sire.hz_aggouti_flag)
          color.modifier_aggouti = ['A', 'A'];
        else
          color.modifier_aggouti = ['A', '-'];
      } else {
        color.modifier_aggouti = ['a', 'a'];
      };
      if (this.sire.silver_flag) {
        if (this.sire.hz_silver_flag)
          color.silver_color = ['I', 'I'];
        else
          color.silver_color = ['I', '-'];
      } else {
        color.silver_color = ['i', 'i'];
      };
      if (this.sire.choco_holder_flag)
        color.fullcolor_color[1] = 'b';
      if (this.sire.cinnamon_holder_flag)
        color.fullcolor_color[1] = 'bl';
      if (this.sire.dilution_holder_flag)
        color.diluted_color[1] = 'd';

        // check point - siamese genes
      if (this.sire.point_flag)
        color.modifier_siamese = ['cs', 'cs'];
      else {
        if (this.sire.point_holder_flag)
          color.modifier_siamese = ['Cs', 'cs'];
        else
          color.modifier_siamese = ['Cs', '-'];
      };

      // create color object
      this.sire.color_obj = color;
      
      return ems_genotype_obj_to_str(color);
    },

    dam_ems_color: function () {
      let color = ems_genotype_obj(this.dam.color, 'female');

      if (this.dam.aggouti_flag) {
        if (this.dam.hz_aggouti_flag)
          color.modifier_aggouti = ['A', 'A'];
        else
          color.modifier_aggouti = ['A', '-'];
      } else {
        color.modifier_aggouti = ['a', 'a'];
      };
      if (this.dam.silver_flag) {
        if (this.dam.hz_silver_flag)
          color.silver_color = ['I', 'I'];
        else
          color.silver_color = ['I', '-'];
      } else {
        color.silver_color = ['i', 'i'];
      };
      if (this.dam.choco_holder_flag)
        color.fullcolor_color[1] = 'b';
      if (this.dam.cinnamon_holder_flag)
        color.fullcolor_color[1] = 'bl';
      if (this.dam.dilution_holder_flag)
        color.diluted_color[1] = 'd';

        // check point - siamese genes
      if (this.dam.point_flag)
        color.modifier_siamese = ['cs', 'cs'];
      else {
        if (this.dam.point_holder_flag)
          color.modifier_siamese = ['Cs', 'cs'];
        else
          color.modifier_siamese = ['Cs', '-'];
      };

      // create color object
      this.dam.color_obj = color;

      return ems_genotype_obj_to_str(color);
    },

    permalink_query: function () {
      return {
        dam: btoa(JSON.stringify(this.dam)),
        sire: btoa(JSON.stringify(this.sire))
      }
    },
  },
  watch: {
    // whenever question changes, this function will run
    sire_ems_color: function (newval, oldval) {
      if (newval != oldval) {
        this.do_breeding();
      };
    },
    dam_ems_color: function (newval, oldval) {
      if (newval != oldval) {
        this.do_breeding();
      };
    }
  },

  // when mounting, analyse query parameters
  beforeMount: function () {
    if (this.$route.query.sire) {
      this.sire = JSON.parse(atob(this.$route.query.sire))
    };
    if (this.$route.query.dam) {
      this.dam = JSON.parse(atob(this.$route.query.dam))
    };
    this.do_breeding();
  },
});

