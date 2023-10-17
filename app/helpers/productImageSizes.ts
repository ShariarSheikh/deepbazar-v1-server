interface IReturn {
  width: number
  height: number
  format: string
}

export default function productImageSizes(): IReturn[] {
  return [
    { width: 450, height: 450, format: 'webp' }, // details page image
    { width: 300, height: 300, format: 'webp' }, // card image
    { width: 75, height: 75, format: 'webp' }, // card small
    { width: 40, height: 40, format: 'webp' } // comment
  ]
}

export function profileImageSize(): IReturn[] {
  return [{ width: 120, height: 120, format: 'webp' }]
}
