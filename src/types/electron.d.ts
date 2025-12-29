import { ElectronApi } from '../../electron/types/global'

declare global {
  interface Window {
    electronApi: ElectronApi
  }
}
