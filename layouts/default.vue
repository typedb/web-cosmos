<template>
  <div>
    <the-header />
    <main style="min-height: 1500px;">
      <nuxt />
    </main>
    <the-newsletter />
    <the-footer />
  </div>
</template>

<script>
import TheHeader from "@/components/TheHeader";
import TheNewsletter from "@/components/TheNewsletter";
import TheFooter from "@/components/TheFooter";

export default {
  components: {
    TheHeader,
    TheNewsletter,
    TheFooter
  }
};
</script>
