import { TFileContentType } from '@/schemas/file'
export function getFileContentTypeLabel(contentType: TFileContentType) {
  switch (contentType) {
    case 'application/pdf':
      return 'PDF'
    case 'application/msword':
      return 'Word Document'
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'Word Document (OpenXML)'
    case 'application/vnd.ms-excel':
      return 'Excel Document'
    default:
      return contentType
  }
}
