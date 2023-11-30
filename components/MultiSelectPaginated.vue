<template>
  <UCheckbox
    v-for="(option, idx) in modelValue.values()"
    :key="`selected-${option.value}`"
    class="label-w-full"
    :ui="{ label: 'flex' }"
    :model-value="true"
    checked
    @click="removeSelected(option)"
  >
    <template #label>
      {{ option.name }}
      <UBadge size="xs" class="ml-auto">
        {{ selectedCounts?.[option.value] ?? 0 }}
      </UBadge>
    </template>
  </UCheckbox>
  <UDivider v-if="modelValue.size > 0" />
  <UInput
    :model-value="query"
    :placeholder="t('search')"
    @update:model-value="emit('update:query', $event)"
    :ui="{ icon: { trailing: { pointer: '' } } }"
  >
    <template #trailing>
      <UButton
        v-show="query !== ''"
        color="gray"
        variant="link"
        icon="i-heroicons-x-mark-20-solid"
        :padded="false"
        @click="emit('update:query', '')"
      />
    </template>
  </UInput>
  <template v-if="options.length > 0">
    <UCheckbox
      v-for="(option, idx) in options"
      :key="`options-${option.value}`"
      class="label-w-full"
      :ui="{ label: 'flex' }"
      :checked="modelValue.has(option.value)"
      :model-value="modelValue.has(option.value)"
      :disabled="modelValue.has(option.value)"
      :label="option.name"
      @click="addOption(option)"
    >
      <template #label>
        {{ option.name }}
        <UBadge size="xs" class="ml-auto">{{ option.count }}</UBadge>
      </template>
    </UCheckbox>
  </template>
  <template v-else>
    <div class="text-center text-gray-500">
      {{ t("noMoreOptions") }}
    </div>
  </template>
  <div class="flex items-center justify-around">
    <UButton
      variant="link"
      icon="i-heroicons-chevron-double-left"
      :disabled="pagination.page <= 1"
      @click="prevPage"
    />
    <span>{{ pagination.page }}</span>
    <UButton
      variant="link"
      icon="i-heroicons-chevron-double-right"
      :disabled="!hasNextPage"
      @click="nextPage"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  "update:model-value": [value: Set<string>];
  "update:pagination": [value: { page: number; paginateBy: number }];
  "update:query": [value: string];
  add: [value: any];
  remove: [value: any];
}>();

const props = defineProps<{
  modelValue: Set<any>;
  selectedCounts: { [K: string]: number };
  pagination: { page: number; paginateBy: number };
  query: string;
  options: any[];
}>();

const { t } = useI18n({ useScope: "local" });

const selected = ref(new Set());

const hasNextPage = computed(() => {
  return !(props.options.length < props.pagination.paginateBy);
});

selected.value = props.modelValue;

function removeSelected(option) {
  selected.value.delete(option);
  // emit("update:model-value", selected.value);
  emit("remove", option);
}
function addOption(option) {
  selected.value.add(option);
  // emit("update:model-value", selected.value);
  emit("add", option);
}
function prevPage() {
  emit("update:pagination", {
    ...props.pagination,
    page: props.pagination.page - 1,
  });
}
function nextPage() {
  emit("update:pagination", {
    ...props.pagination,
    page: props.pagination.page + 1,
  });
}
</script>

<style scoped lang="scss">
.label-w-full :deep(.text-sm) {
  @apply w-full;
}
</style>

<i18n lang="yaml">
et:
  search: "Otsi"
  noMoreOptions: "Valikud puuduvad"
en:
  search: "Search"
  noMoreOptions: "No options available"
</i18n>
