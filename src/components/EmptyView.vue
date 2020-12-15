<template>
  <div class="uk-section uk-section-muted">
    <div class="uk-container">
      <h3>No content</h3>

      <div class="uk-grid-match uk-child-width-1-3@m" uk-grid>
        <div>
          <p>
            Add new tab with .proto directory by clicking the
            <span uk-icon="plus" /> button.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const EmptyView = defineComponent({});

export default EmptyView;
</script>