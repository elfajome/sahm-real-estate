import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input.jsx'
import { Select } from '@/components/ui/Select.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { MapPicker } from '@/components/forms/MapPicker.jsx'
import { ImageUploadField } from '@/components/forms/ImageUploadField.jsx'
import { FieldRow, RadioPillGroup, SectionHeader } from '@/components/forms/FormSection.jsx'
import { RealEstateConditionalFields } from '@/components/forms/RealEstateConditionalFields.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { lookupsService } from '@/services/index.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { lookupLabel } from '@/utils/lookupLabel.js'
import { cn } from '@/utils/cn.js'
import {
  CONDITIONAL_FIELD_DEFAULTS,
  CONDITIONAL_FIELD_ORDER,
  getConditionalFieldRules,
  resolveRealEstateTypeKey,
} from '@/constants/realEstateTypes.js'

/**
 * Postman `store/aqar` fields with no visible control for the selected
 * Real Estate type (docs/api/endpoint-map.md) — always sent with
 * backend-safe defaults. The conditional fields are overridden per selected
 * type on submit; `fees` has no UI control in the original design.
 */
const HIDDEN_DEFAULTS = {
  ...CONDITIONAL_FIELD_DEFAULTS,
  fees: '0',
}

const asString = (v) => (v == null ? '' : String(v))

/**
 * Validation schema built from the SAME conditional matrix that drives
 * field visibility (src/constants/realEstateTypes.js), so the required `*`
 * indicators and the validation can never diverge (implement.md §15, §29).
 * Hidden fields have no rules — e.g. a Company submission never fails
 * because `room_no` is empty.
 */
function buildPropertySchema(t, rules) {
  const requiredMsg = t('propertyForm.validationRequired')
  const priceMsg = t('propertyForm.validationPrice')
  const numberMsg = t('propertyForm.validationNumber')
  const required = z.preprocess(asString, z.string().min(1, requiredMsg))
  const requiredNumber = z.preprocess(
    asString,
    z
      .string()
      .min(1, requiredMsg)
      .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, numberMsg),
  )
  const shape = {
    type_id: required,
    aqar_type: required,
    area_id: required,
    title: required,
    description: required,
    price: z.preprocess(
      asString,
      z
        .string()
        .min(1, requiredMsg)
        .refine((v) => Number(v) > 0, priceMsg),
    ),
  }
  for (const name of rules.visible) {
    if (!rules.required.includes(name)) continue // optional — no validation rule
    shape[name] = name === 'nature_id' ? required : requiredNumber
  }
  return z.looseObject(shape)
}

export function PropertyForm({ onSubmit, defaultValues = {}, submitLabel }) {
  const { t, locale } = useLocale()
  const isEdit = Boolean(defaultValues.post_id)
  const {
    register,
    handleSubmit,
    setValue,
    unregister,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: (...args) => zodResolver(schemaRef.current)(...args),
    defaultValues: { pin: '0', pay_type: '0', user_pay_type: '0', offer: '0', ...defaultValues },
  })
  const [areas, setAreas] = useState([])
  const [types, setTypes] = useState([])
  const [statuses, setStatuses] = useState([])
  const [natures, setNatures] = useState([])
  const [images, setImages] = useState([])
  const [imageError, setImageError] = useState('')

  const lat = watch('lat')
  const lng = watch('lng')

  // Conditional "More" section — driven by the selected Real Estate type.
  // The stable type key is resolved from the lookup item (canonical name),
  // never from a translated label or a hardcoded id (implement.md §27).
  const aqarType = watch('aqar_type')
  const activeTypeKey = useMemo(() => resolveRealEstateTypeKey(types, aqarType), [types, aqarType])
  const rules = useMemo(() => getConditionalFieldRules(activeTypeKey), [activeTypeKey])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const schema = useMemo(() => buildPropertySchema(t, rules), [t, locale, rules])
  const schemaRef = { current: schema }

  // Type switching cleanup: unregister fields that are no longer applicable
  // so their values and validation errors are removed (implement.md §14).
  // `keepDefaultValue` lets edit mode restore stored values if the user
  // switches back to a type where the field applies again.
  useEffect(() => {
    if (!activeTypeKey) return
    for (const name of CONDITIONAL_FIELD_ORDER) {
      if (!rules.visible.includes(name)) unregister(name, { keepDefaultValue: true })
    }
  }, [activeTypeKey, rules, unregister])

  useEffect(() => {
    ;(async () => {
      const [a, ty, st, na] = await Promise.all([
        lookupsService.getAreas(),
        lookupsService.getAqarTypes(),
        lookupsService.getAqarStatuses(),
        lookupsService.getAqarNatures(),
      ])
      setAreas(normalizeList(a))
      setTypes(normalizeList(ty))
      setStatuses(normalizeList(st))
      setNatures(normalizeList(na))
    })()
  }, [])

  const handleImagesChange = (next) => {
    setImages(next)
    if (next.length) setImageError('')
  }

  const handleFormSubmit = async (data) => {
    // Images are required by the original design when creating a listing.
    // Edit mode keeps them optional — the listing already has stored images.
    if (!isEdit && images.length === 0) {
      setImageError(t('propertyForm.validationImages'))
      return
    }
    const fields = { ...HIDDEN_DEFAULTS, ...data }
    // Conditional fields: ONLY values visible for the selected type are
    // submitted; everything else falls back to backend-safe defaults so
    // stale values from a previously selected type never reach the API
    // (implement.md §14) while the full Postman contract is preserved.
    for (const name of CONDITIONAL_FIELD_ORDER) {
      const value = rules.visible.includes(name) ? data[name] : undefined
      fields[name] = value == null || value === '' ? HIDDEN_DEFAULTS[name] : String(value)
    }
    delete fields.images
    if (images.length) fields.images = images
    // Await so `isSubmitting` stays true for the whole request —
    // the submit button is disabled meanwhile (duplicate-submit prevention).
    await onSubmit(fields)
  }

  const handleMapChange = ({ lat: nextLat, lng: nextLng }) => {
    setValue('lat', nextLat || '0')
    setValue('lng', nextLng || '0')
  }

  const statusOptions = statuses.map((s) => ({ value: String(s.id), label: lookupLabel(t, s) }))

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto w-full max-w-5xl space-y-10 px-4 sm:px-6"
      noValidate
    >
      {/* ── Section 1 — Real Estate type, ownership & location ────────────── */}
      <section className="space-y-6">
        <SectionHeader>{t('propertyForm.sectionTypeLocation')}</SectionHeader>

        <FieldRow label={t('propertyForm.status')} required align="top">
          <RadioPillGroup
            name="type_id"
            options={statusOptions}
            register={register}
            error={errors.type_id?.message}
            errorId="type_id-error"
          />
        </FieldRow>

        <FieldRow label={t('propertyForm.type')} htmlFor="aqar_type" required>
          <Select id="aqar_type" error={errors.aqar_type?.message} {...register('aqar_type')}>
            <option value="">{t('propertyForm.type')}</option>
            {types.map((ty) => (
              <option key={ty.id} value={ty.id}>
                {lookupLabel(t, ty)}
              </option>
            ))}
          </Select>
        </FieldRow>

        <FieldRow label={t('propertyForm.city')} htmlFor="area_id" required>
          <Select id="area_id" error={errors.area_id?.message} {...register('area_id')}>
            <option value="">{t('propertyForm.city')}</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {lookupLabel(t, a)}
              </option>
            ))}
          </Select>
        </FieldRow>

        {/* Large map — spans the full form width */}
        <MapPicker lat={lat} lng={lng} onChange={handleMapChange} />
        <input type="hidden" {...register('lat')} />
        <input type="hidden" {...register('lng')} />

        <FieldRow label={t('propertyForm.address')} htmlFor="title" required>
          <Input id="title" error={errors.title?.message} {...register('title')} />
        </FieldRow>
      </section>

      {/* ── Section 2 — More details (conditional per Real Estate type) ───── */}
      <section className="space-y-6">
        <SectionHeader>{t('propertyForm.sectionMore')}</SectionHeader>

        <FieldRow label={t('propertyForm.content')} htmlFor="description" required align="top">
          <div>
            <textarea
              id="description"
              rows={7}
              className={cn(
                'w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text focus-visible:border-primary focus-visible:outline-none',
                errors.description && 'border-red-500',
              )}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'description-error' : undefined}
              {...register('description')}
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-xs text-red-600" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>
        </FieldRow>

        <FieldRow label={t('propertyForm.price')} htmlFor="price" required>
          <Input
            id="price"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            error={errors.price?.message}
            {...register('price')}
          />
        </FieldRow>

        {/* Type-specific fields — rendered ONLY when applicable; hidden fields
            are unmounted so the layout reflows with no blank gaps. */}
        <RealEstateConditionalFields
          rules={rules}
          register={register}
          errors={errors}
          natures={natures}
        />
      </section>

      {/* ── Section 3 — Upload images (multiple) ──────────────────────── */}
      <section className="space-y-6">
        <SectionHeader required>{t('propertyForm.sectionUpload')}</SectionHeader>
        <ImageUploadField images={images} onChange={handleImagesChange} error={imageError} />
      </section>

      {/* ── Section 4 — Pinning ────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader>{t('propertyForm.sectionPin')}</SectionHeader>
        <RadioPillGroup
          name="pin"
          options={[
            { value: '1', label: t('propertyForm.pinAd') },
            { value: '0', label: t('propertyForm.pinNone') },
          ]}
          register={register}
        />
      </section>

      {/* ── Section 5 — Payment type, fees & discount ───────────────────── */}
      <section className="space-y-6">
        <SectionHeader required>{t('propertyForm.sectionPayType')}</SectionHeader>

        <RadioPillGroup
          name="pay_type"
          options={[
            { value: '0', label: t('propertyForm.paySite') },
            { value: '1', label: t('propertyForm.payUser') },
          ]}
          register={register}
        />

        <RadioPillGroup
          name="user_pay_type"
          options={[
            { value: '0', label: t('propertyForm.feeDeduct') },
            { value: '1', label: t('propertyForm.feeAdd') },
          ]}
          register={register}
        />

        <FieldRow label={t('propertyForm.discount')} htmlFor="offer">
          <Input id="offer" type="number" min="0" step="any" inputMode="decimal" {...register('offer')} />
        </FieldRow>
      </section>

      {/* Compact submit button aligned to the page direction */}
      <div className="flex justify-start pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('propertyForm.submitting') : (submitLabel ?? t('propertyForm.submit'))}
        </Button>
      </div>
    </form>
  )
}
