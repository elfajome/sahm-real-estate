import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input.jsx'
import { Select } from '@/components/ui/Select.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { FieldRow, RadioPillGroup, SectionHeader } from '@/components/forms/FormSection.jsx'
import { ImageUploadField } from '@/components/forms/ImageUploadField.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { lookupsService } from '@/services/index.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { lookupLabel } from '@/utils/lookupLabel.js'
import { cn } from '@/utils/cn.js'

const asString = (v) => (v == null ? '' : String(v))

/**
 * Validation for the Postman `store/construction` payload:
 * title, description, space, construction_type, area_id (+ images[]).
 */
function buildConstructionSchema(t) {
  const requiredMsg = t('propertyForm.validationRequired')
  const spaceMsg = t('constructions.validationSpace')
  const required = z.preprocess(asString, z.string().min(1, requiredMsg))
  return z.looseObject({
    construction_type: required,
    area_id: required,
    title: required,
    description: required,
    space: z.preprocess(
      asString,
      z
        .string()
        .min(1, requiredMsg)
        .refine((v) => Number(v) > 0, spaceMsg),
    ),
  })
}

export function ConstructionForm({ onSubmit, submitLabel }) {
  const { t, locale } = useLocale()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const schema = useMemo(() => buildConstructionSchema(t), [t, locale])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })
  const [types, setTypes] = useState([])
  const [areas, setAreas] = useState([])
  const [images, setImages] = useState([])

  useEffect(() => {
    ;(async () => {
      const [ty, ar] = await Promise.all([
        lookupsService.getConstructionTypes(),
        lookupsService.getAreas(),
      ])
      setTypes(normalizeList(ty))
      setAreas(normalizeList(ar))
    })()
  }, [])

  const handleFormSubmit = async (data) => {
    // Explicit Postman `store/construction` payload. `map_location` is a
    // UI-only field from the original design — the API contract has no
    // location/coordinates field for constructions, so it is NOT submitted.
    const fields = {
      title: data.title,
      description: data.description,
      space: data.space,
      construction_type: data.construction_type,
      area_id: data.area_id,
    }
    if (images.length) fields.images = images
    // Await so `isSubmitting` stays true for the whole request —
    // the submit button is disabled meanwhile (duplicate-submit prevention).
    await onSubmit(fields)
  }

  const typeOptions = types.map((ct) => ({ value: String(ct.id), label: lookupLabel(t, ct) }))

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto w-full max-w-5xl space-y-10 px-4 sm:px-6"
      noValidate
    >
      {/* ── Section 1 — Construction type / location ──────────────────── */}
      <section className="space-y-6">
        <SectionHeader>{t('propertyForm.sectionTypeLocation')}</SectionHeader>

        <FieldRow label={t('constructions.status')} required align="top">
          <RadioPillGroup
            name="construction_type"
            indicator
            options={typeOptions}
            register={register}
            error={errors.construction_type?.message}
            errorId="construction_type-error"
          />
        </FieldRow>

        <FieldRow label={t('constructions.city')} htmlFor="area_id" required>
          <Select id="area_id" error={errors.area_id?.message} {...register('area_id')}>
            <option value="">{t('constructions.city')}</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {lookupLabel(t, a)}
              </option>
            ))}
          </Select>
        </FieldRow>

        <FieldRow label={t('constructions.address')} htmlFor="title" required>
          <Input id="title" error={errors.title?.message} {...register('title')} />
        </FieldRow>

        {/* UI-only per the original design — excluded from the payload (see handleFormSubmit). */}
        <FieldRow label={t('constructions.mapLocation')} htmlFor="map_location">
          <Input id="map_location" {...register('map_location')} />
        </FieldRow>
      </section>

      {/* ── Section 2 — More details ───────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader>{t('propertyForm.sectionMore')}</SectionHeader>

        <FieldRow label={t('constructions.content')} htmlFor="description" required align="top">
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

        <FieldRow label={t('constructions.space')} htmlFor="space" required>
          <Input
            id="space"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            error={errors.space?.message}
            {...register('space')}
          />
        </FieldRow>
      </section>

      {/* ── Section 3 — Upload images (multiple, per Postman images[]) ──────── */}
      <section className="space-y-6">
        <SectionHeader>{t('propertyForm.sectionUpload')}</SectionHeader>
        <ImageUploadField images={images} onChange={setImages} />
      </section>

      {/* Compact submit button aligned to the page direction */}
      <div className="flex justify-start pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('constructions.submitting') : (submitLabel ?? t('constructions.submit'))}
        </Button>
      </div>
    </form>
  )
}
