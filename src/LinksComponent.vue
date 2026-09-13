<script setup>
defineEmits(['go-home'])
</script>

<template>
  <nav class="navbar sticky-top">
    <div class="container">
      <h2 class="navbar-brand mb-0">عارف أحمد</h2>
      <div class="nav-shapes">
        <a href="#" class="home-shape" aria-label="الرئيسية" @click.prevent="$emit('go-home')">
          <i class="fa-solid fa-house"></i>
          <span>الرئيسية</span>
        </a>
      </div>
    </div>
  </nav>
</template>
