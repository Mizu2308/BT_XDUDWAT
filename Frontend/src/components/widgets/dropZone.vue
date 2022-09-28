
<template>
  <div>
    <div
      v-if="type === 'drop-file'"
      @dragenter.prevent="toggleActive"
      @dragleave.prevent="toggleActive"
      @dragover.prevent
      @drop.prevent="toggleActive"
      :class="{ 'active-dropzone': active, 'is-invalid': error }"
      class="dropzone position-relative"
    >
      <div class="mb-1">
          <i class="display-4 text-muted ri-upload-cloud-2-fill"></i>
      </div>

      <h5 class="text-center">Drop files here or click to upload.</h5>
      <label for="dropzoneFile" class="bg-light text-dark stretched-link">Upload</label>
      <input :disabled="disabled" accept="image/*"  type="file" id="dropzoneFile" @change="onChange" class="dropzoneFile btn btn-primary" />
      
    </div>
    <div v-else :class="{ 'is-invalid': error }">
      <input @change="onChange" accept="image/*" type="file" class="form-control" :disabled="disabled" >
    </div>

    <div v-if="error" class="invalid-feedback text-center">
      {{ error }}
    </div>
  </div>
</template>


<script>
import { ref } from "vue";
import i18n from '@/i18n'

export default {
  name: "dropzone",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "drop-file",
    }
  },
  setup(props, { emit }) {
    const active = ref(false);

    const toggleActive = async (e) => {
      if (props.disabled) {
        return;
      }
      active.value = !active.value;
      const file = e.dataTransfer.files[0];
      const check = await validateFile(file);
      if (check) {
        emit('selectedFile', file);
      }
    };

    const error = ref('');
    const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

    const validateFile = async (file) => {
      if (file.size / 1024 / 1024 > 10) {
        error.value = i18n.global.t('t-err-upload')
        return false;
      }
      if(!allowedExtensions.includes(file.type)) {
        error.value = `File extension not supported!`
        return false;
      }
      error.value = '';
      return true;
    }

    const onChange = async (e) => {
      if (props.disabled) {
        return;
      }
      const files = e.target.files || e.dataTransfer.files;
      const file = files[0] || null;
      const check = await validateFile(file);
      if (check) {
        emit('selectedFile', file);
      }
    }

    return { active, error, toggleActive, onChange };
  },
};
</script>
