const app = Vue.createApp({
    data() {
        return {
            currentPage: 'home',

            images: [
                "./imges/imgess (1).jpeg",
                "./imges/imgess(2).jpeg",
                "./imges/imgess(3).jpeg"
            ],
            campaigns: [
                "مع مستر عارف يا عم ... متشلش هم .... كده كده المادة هتتلم",
                "مستني إيه؟ احجز مكانك دلوقتي!",
                "تعلم الرياضيات بطريقة ممتعة وفعالة مع مستر عارف!"
            ],
            currentIndex: 0,
            heroOpacity: 1,
            autoSlideTimer: null,
            startX: 0,
            isDragging: false,
            swiperInstance: null,

            // بيانات نماذج الحجز
            form1Data: { name: '', phone: '', parentPhone: '', gender: '', timeSlot: '' },
            form2Data: { name: '', phone: '', parentPhone: '', gender: '', timeSlot: '' },
            form3Data: { name: '', phone: '', parentPhone: '', gender: '', timeSlot: '' },

            // كائنات أخطاء التحقق من صحة المدخلات
            form1Errors: { name: '' },
            form2Errors: { name: '' },
            form3Errors: { name: '' },

            // مصفوفة بيانات المراحل الإعدادية
            prepGradesData: [
                {
                    id: "first_prep",
                    gradeName: "الصف الأول الإعدادي",
                    startDate: "السبت 12 سبتمبر و الايام هيا الجمعه والاثنين",
                    Female_appointments: [
                        "8:00 صباحًا",
                        "3:00 مساءً",
                        "4:30 مساءً",
                        "7:30 مساءً"
                    ],
                    Male_appointments: [
                        "10:00 صباحًا",
                        "3:00 مساءً",
                        "6:00 مساءً",
                        "9:30 مساءً"
                    ]
                },
                {
                    id: "second_prep",
                    gradeName: "الصف الثاني الإعدادي",
                    startDate: "السبت 19 سبتمبر و الايام هيا الاحد و الاربعاء",
                    Female_appointments: [
                        "8:00 صباحًا",
                        "4:00 مساءً",
                        "7:30 مساءً"
                    ],
                    Male_appointments: [
                        "10:00 صباحًا",
                        "5:30 مساءً",
                        "9:00 مساءً"
                    ]
                },
                {
                    id: "third_prep",
                    gradeName: "الصف الثالث الإعدادي",
                    startDate: "السبت 26 سبتمبر و الايام هيا السبت و الثلاثاء",
                    Female_appointments: [
                        "8:00 صباحًا",
                        "4:00 مساءً",
                        "7:30 مساءً"
                    ],
                    Male_appointments: [
                        "10:00 صباحًا",
                        "5:30 مساءً",
                        "9:00 مساءً"
                    ]
                }
            ]
        };
    },
    computed: {
        form1AvailableAppointments() {
            if (this.form1Data.gender === 'ذكر') return this.prepGradesData[0].Male_appointments;
            if (this.form1Data.gender === 'أنثى') return this.prepGradesData[0].Female_appointments;
            return [];
        },
        form2AvailableAppointments() {
            if (this.form2Data.gender === 'ذكر') return this.prepGradesData[1].Male_appointments;
            if (this.form2Data.gender === 'أنثى') return this.prepGradesData[1].Female_appointments;
            return [];
        },
        form3AvailableAppointments() {
            if (this.form3Data.gender === 'ذكر') return this.prepGradesData[2].Male_appointments;
            if (this.form3Data.gender === 'أنثى') return this.prepGradesData[2].Female_appointments;
            return [];
        }
    },
    methods: {
        goToPage(pageName) {
            this.currentPage = pageName;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        onGenderChange(formNum) {
            if (formNum === 1) this.form1Data.timeSlot = '';
            if (formNum === 2) this.form2Data.timeSlot = '';
            if (formNum === 3) this.form3Data.timeSlot = '';
        },

        // --- validation Logic ---
        validateName(formNumber) {
            let name = '';
            let errorsObj = null;

            if (formNumber === 1) {
                name = this.form1Data.name.trim();
                errorsObj = this.form1Errors;
            } else if (formNumber === 2) {
                name = this.form2Data.name.trim();
                errorsObj = this.form2Errors;
            } else if (formNumber === 3) {
                name = this.form3Data.name.trim();
                errorsObj = this.form3Errors;
            }

            // 1. التثبت من أنه غير فارغ
            if (!name) {
                errorsObj.name = 'يرجى إدخال اسم الطالب.';
                return false;
            }

            // 2. التثبت من عدم وجود أرقام أو رموز خاصة
            const hasNumbersOrSymbols = /[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/g.test(name);
            if (hasNumbersOrSymbols) {
                errorsObj.name = 'الاسم يجب ألا يحتوي على أرقام أو رموز.';
                return false;
            }

            // تقسيم الاسم إلى كلمات
            const words = name.split(/\s+/);

            // 3. التثبت من أن الاسم ثلاثي على الأقل (3 كلمات أو أكثر)
            if (words.length < 3) {
                errorsObj.name = 'يرجى كتابة الاسم ثلاثي على الأقل (مثال: أحمد محمد علي).';
                return false;
            }

            // 4. التثبت من أن كل كلمة مكونة من 3 أحرف على الأقل
            const isAnyWordTooShort = words.some(word => word.length < 3);
            if (isAnyWordTooShort) {
                errorsObj.name = 'كل جزء من الاسم يجب ألا يقل عن 3 أحرف.';
                return false;
            }

            errorsObj.name = '';
            return true;
        },

        // --- Slider Methods ---
        changeSlide(index) {
            this.currentIndex = index;
            this.heroOpacity = 0;
            setTimeout(() => { this.heroOpacity = 1; }, 250);
        },
        nextSlide() {
            let newIndex = (this.currentIndex + 1) % this.images.length;
            this.changeSlide(newIndex);
        },
        previousSlide() {
            let newIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
            this.changeSlide(newIndex);
        },

        handleMouseDown(e) { this.startX = e.clientX; this.isDragging = true; },
        handleMouseUp(e) {
            if (!this.isDragging) return;
            const difference = this.startX - e.clientX;
            this.isDragging = false;
            if (difference > 50) this.nextSlide();
            else if (difference < -50) this.previousSlide();
        },
        handleTouchStart(e) { this.startX = e.touches[0].clientX; },
        handleTouchEnd(e) {
            const difference = this.startX - e.changedTouches[0].clientX;
            if (difference > 50) this.nextSlide();
            else if (difference < -50) this.previousSlide();
        },

        handleBookMouseMove(e) {
            const wrapper = e.currentTarget;
            const book = wrapper.querySelector(".book");
            if (!book) return;

            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const mouseX = (x - rect.width / 2) / (rect.width / 2);
            const mouseY = (y - rect.height / 2) / (rect.height / 2);

            const rotateY = mouseX * 180;
            const rotateX = -mouseY * 12;

            book.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        },
        handleBookMouseLeave(e) {
            const book = e.currentTarget.querySelector(".book");
            if (book) {
                book.style.transform = "rotateX(8deg) rotateY(0deg)";
            }
        },

        // --- Form Submissions ---
        submitForm(gradeName, formNum) {
            let formData = formNum === 1 ? this.form1Data : (formNum === 2 ? this.form2Data : this.form3Data);

            // التحقق من الاسم أولاً
            const isNameValid = this.validateName(formNum);

            if (!isNameValid) {
                alert('يرجى تصحيح الخطأ في حقل الاسم قبل تأكيد الحجز.');
                return;
            }

            if (!formData.phone || !formData.gender || !formData.timeSlot) {
                alert('يرجى استكمال جميع البيانات اختيار الجنس والموعد والرقم.');
                return;
            }

            alert(`تم تقديم طلب الحجز بنجاح لـ (${gradeName})\nالطالب: ${formData.name}\nالموعد: ${formData.timeSlot}`);

            // تفريغ النموذج بعد النجاح
            Object.keys(formData).forEach(key => formData[key] = '');
            this.goToPage('home');
        },

        initScrollReveal() {
            const targetElements = document.querySelectorAll("section, .reveal-on-scroll");
            targetElements.forEach((el) => { el.classList.add("reveal-on-scroll"); });

            const revealOnScroll = () => {
                const windowHeight = window.innerHeight;
                targetElements.forEach((el) => {
                    const elementTop = el.getBoundingClientRect().top;
                    if (elementTop < windowHeight - 120) {
                        el.classList.add("active");
                    }
                });
            };

            window.addEventListener("scroll", revealOnScroll);
            revealOnScroll();
        }
    },
    mounted() {
        this.autoSlideTimer = setInterval(this.nextSlide, 5000);

        if (document.querySelector(".mySwiper")) {
            this.swiperInstance = new Swiper(".mySwiper", {
                effect: "cards",
                grabCursor: true,
                initialSlide: 0,
                rotate: true,
                mousewheel: { invert: false },
            });
        }

        this.$nextTick(() => {
            this.initScrollReveal();
        });
    },
    beforeUnmount() {
        if (this.autoSlideTimer) clearInterval(this.autoSlideTimer);
        if (this.swiperInstance) this.swiperInstance.destroy();
    }
});

app.mount('#app');