<script setup>
import { computed, reactive, ref } from 'vue'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, isConfigured } from './services/firebase'

const props = defineProps({ grade: { type: Object, required: true } })
const emit = defineEmits(['go-home'])

const form = reactive({ name: '', phone: '', parentPhone: '', gender: '', timeSlot: '' })
const errors = reactive({ name: '', phone: '', parentPhone: '' })
const isSubmitting = ref(false)
const availableAppointments = computed(() => form.gender === 'ذكر' ? props.grade.maleAppointments : form.gender === 'أنثى' ? props.grade.femaleAppointments : [])

function validateName() {
  const name = form.name.trim()
  if (!name) return errors.name = 'يرجى إدخال اسم الطالب.'
  if (/[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~`]/.test(name)) return errors.name = 'الاسم يجب ألا يحتوي على أرقام أو رموز.'
  const words = name.split(/\s+/)
  if (words.length < 3) return errors.name = 'يرجى كتابة الاسم ثلاثي على الأقل (مثال: أحمد محمد علي).'
  if (words.some((word) => word.length < 3)) return errors.name = 'كل جزء من الاسم يجب ألا يقل عن 3 أحرف.'
  errors.name = ''
  return true
}

function validatePhone(field) {
  form[field] = form[field].replace(/\D/g, '').slice(0, 11)
  if (!form[field]) return errors[field] = 'يرجى إدخال رقم الهاتف.'
  if (!['010', '011', '012', '015'].some((prefix) => form[field].startsWith(prefix))) return errors[field] = 'يجب أن يبدأ الرقم بـ 010 أو 011 أو 012 أو 015.'
  if (form[field].length !== 11) return errors[field] = 'رقم الهاتف يجب أن يتكون من 11 رقماً بالضبط.'
  errors[field] = ''
  return true
}

async function submitForm() {
  const valid = validateName() && validatePhone('phone') && validatePhone('parentPhone')
  if (!valid) return alert('يرجى تصحيح الأخطاء الموضحة في النموذج قبل تأكيد الحجز.')
  if (!form.gender || !form.timeSlot) return alert('يرجى استكمال جميع البيانات باختيار النوع والموعد.')
  if (!isConfigured) return alert('إعدادات Firebase غير مكتملة. أضفها إلى ملف .env أولاً.')

  isSubmitting.value = true
  try {
    await addDoc(collection(db, 'bookings'), {
      gradeName: props.grade.gradeName,
      ...form,
      createdAt: new Date().toLocaleString('ar-EG'),
      timestamp: serverTimestamp(),
    })
    alert(`تم تقديم طلب الحجز بنجاح لـ (${props.grade.gradeName})\nالطالب: ${form.name}\nالموعد: ${form.timeSlot}`)
    Object.assign(form, { name: '', phone: '', parentPhone: '', gender: '', timeSlot: '' })
    emit('go-home')
  } catch (error) {
    console.error('حدث خطأ أثناء الحفظ:', error)
    alert('حدث خطأ أثناء تقديم طلب الحجز، يرجى المحاولة مرة أخرى.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="py-4 py-md-5 form-page-bg d-flex align-items-center justify-content-center">
    <div class="container d-flex flex-column align-items-center">
      <button class="btn btn-back-home mb-4 shadow-sm" @click="$emit('go-home')"><i class="fa-solid fa-arrow-right me-2"></i> العودة للرئيسية</button>
      <div class="card form-card-pro">
        <div class="form-card-header"><h4>حجز {{ grade.gradeName }}</h4><p>يرجى ملء كافة البيانات لتأكيد حجز المقعد</p><p class="mb-0 text-white-50">علماً بأن تاريخ بدء الحصص هو: <strong class="text-white fw-bold">{{ grade.startDate }}</strong></p></div>
        <form class="p-4 booking-form" @submit.prevent="submitForm">
          <div class="mb-3"><label class="pro-label"><i class="fa-solid fa-user"></i> اسم الطالب ثلاثي</label><input v-model="form.name" class="form-control pro-input" :class="{ 'is-invalid': errors.name }" placeholder="أدخل اسم الطالب الكامل (مثال: أحمد محمد علي)" required @input="validateName"><div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div></div>
          <div class="mb-3"><label class="pro-label"><i class="fa-solid fa-phone"></i> رقم هاتف الطالب</label><input v-model="form.phone" class="form-control pro-input" :class="{ 'is-invalid': errors.phone }" placeholder="01XXXXXXXXX" maxlength="11" required @input="validatePhone('phone')"><div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div></div>
          <div class="mb-3"><label class="pro-label"><i class="fa-solid fa-users"></i> رقم هاتف ولي الأمر</label><input v-model="form.parentPhone" class="form-control pro-input" :class="{ 'is-invalid': errors.parentPhone }" placeholder="01XXXXXXXXX" maxlength="11" required @input="validatePhone('parentPhone')"><div v-if="errors.parentPhone" class="invalid-feedback">{{ errors.parentPhone }}</div></div>
          <div class="mb-3"><label class="pro-label"><i class="fa-solid fa-venus-mars"></i> النوع</label><select v-model="form.gender" class="form-select pro-input" required @change="form.timeSlot = ''"><option disabled value="">اختر النوع</option><option value="ذكر">ذكر</option><option value="أنثى">أنثى</option></select></div>
          <div v-if="form.gender" class="mb-4"><label class="pro-label"><i class="fa-regular fa-clock"></i> اختيار الموعد المناسب</label><select v-model="form.timeSlot" class="form-select pro-input" required><option disabled value="">اختر الموعد</option><option v-for="time in availableAppointments" :key="time" :value="time">{{ time }}</option></select></div>
          <button type="submit" class="btn btn-pro-submit w-100 shadow-sm" :disabled="isSubmitting"><span>{{ isSubmitting ? 'جاري الحجز...' : 'تأكيد الحجز الآن' }}</span><i class="fa-solid fa-paper-plane"></i></button>
        </form>
      </div>
    </div>
  </section>
</template>
