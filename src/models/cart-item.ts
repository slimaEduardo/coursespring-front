import { ProdutoDTO } from "./produto.dto";

export interface CartItem{
    quantity: number,
    product: ProdutoDTO
}