<template>
  <div>
    <p>这是主要内容</p>
  </div>
</template>
<script>
export default {
  methods: {
    clickHandler() {
      alert(Date.now())
    }
  },
  init() {
    console.log(1);
  }
}
</script>

