<script setup>
import { computed, ref } from 'vue'

import FooterComponent from './FooterComponent.vue'
import LinksComponent from './LinksComponent.vue'
import MainComponent from './MainComponent.vue'
import BookingFormComponent from './BookingFormComponent.vue'

const currentPage = ref('home')

const grades = [
  {
    id: 'prep1',
    gradeName: 'الصف الأول الإعدادي',
    startDate: 'السبت 12 سبتمبر والايام هي الجمعة والاثنين',
    femaleAppointments: [
      '8:00 صباحًا',
      '3:00 مساءً',
      '4:30 مساءً',
      '7:30 مساءً',
    ],
    maleAppointments: [
      '10:00 صباحًا',
      '3:00 مساءً',
      '6:00 مساءً',
      '9:30 مساءً',
    ],
  },
  {
    id: 'prep2',
    gradeName: 'الصف الثاني الإعدادي',
    startDate: 'السبت 19 سبتمبر والايام هي الأحد والأربعاء',
    femaleAppointments: [
      '8:00 صباحًا',
      '4:00 مساءً',
      '7:30 مساءً',
    ],
    maleAppointments: [
      '10:00 صباحًا',
      '5:30 مساءً',
      '9:00 مساءً',
    ],
  },
  {
    id: 'prep3',
    gradeName: 'الصف الثالث الإعدادي',
    startDate: 'السبت 26 سبتمبر والايام هي السبت والثلاثاء',
    femaleAppointments: [
      '8:00 صباحًا',
      '4:00 مساءً',
      '7:30 مساءً',
    ],
    maleAppointments: [
      '10:00 صباحًا',
      '5:30 مساءً',
      '9:00 مساءً',
    ],
  },
]

const selectedGrade = computed(() =>
  grades.find((grade) => grade.id === currentPage.value),
)

function navigate(page) {
  currentPage.value = page

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="app-shell">
    <LinksComponent @go-home="navigate('home')" />

    <MainComponent
      v-if="currentPage === 'home'"
      @open-booking="navigate"
    />

    <BookingFormComponent
      v-else-if="selectedGrade"
      :grade="selectedGrade"
      @go-home="navigate('home')"
    />

    <FooterComponent />
  </div>
</template>