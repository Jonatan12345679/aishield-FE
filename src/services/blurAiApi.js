
import { request } from './apiClient'

export const blurAiApi = {
  scanPrivacy: (file, options = {}) => {
    if (!file) throw new Error('Tidak ada gambar yang dipilih.')
    const formData = new FormData()
    formData.append('image', file)

    return request('/scan', {
      method: 'POST',
      body: formData,
      isFormData: true,
      ...options,
    })
  },

  blurPrivacy: (file, options = {}) => {
    if (!file) throw new Error('Tidak ada gambar yang dipilih.')
    const formData = new FormData()
    formData.append('image', file)

    return request('/blur', {
      method: 'POST',
      body: formData,
      isFormData: true,
      ...options,
    })
  },
}