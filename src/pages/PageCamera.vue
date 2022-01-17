<template>
  <q-page class="constrain q-pa-md">
    <div class="camera-frame q-pa-md">
      <img
        class="full-width"
        src="https://picsum.photos/id/1025/600/400"
        alt="">
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        round 
        color="grey-10"
        icon="eva-camera" 
        size="lg"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageCamera'
}
</script>
<style lang="sass">
  .camera-frame 
    border: 2px solid $grey-10
    border-radius: 10px
</style>