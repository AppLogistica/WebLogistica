import { toast } from "react-hot-toast"


export function menssagem(menssagem: string, Erro: boolean) {
    if (!Erro) {
      return toast.success(menssagem, { duration: 3000 })
    } else {
      return toast.error(menssagem, { duration: 3000 })
    }
    
  }
