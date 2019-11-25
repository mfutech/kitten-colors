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

var app = new Vue({
  el: '#EMSCodeTranslator',
  data: {
    color: '--',
    unknown: "",
    ems_code: '',
    genotype: "",
  },

  methods: {
    do_translation: function () {
      this.color = ems_translate(this.ems_code);
      this.genotype = ems_genotype(this.ems_code);
    }
  }
});

var breeding = new Vue({
  el: '#Breeding',
  data: {
    father_ems: "",
    father_color: "",
    father_genotype: "",
    mother_ems: "",
    mother_color: "",
    mother_genotype: "",
    kitten_colors: ["-", "-"],
  },
  methods: {
    do_breeding: function () {
      this.father_color = ems_translate(this.father_ems);
      this.father_genotype = ems_genotype(this.father_ems, 'male');
      this.mother_color = ems_translate(this.mother_ems);
      this.mother_genotype = ems_genotype(this.mother_ems, 'female');
      this.kitten_colors = ems_breeding(this.father_ems, this.mother_ems)
    }
  }
});

