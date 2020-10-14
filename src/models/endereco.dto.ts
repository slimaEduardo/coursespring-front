import { CidadeDTO } from "./cidade.dto";

export interface EnderecoDTO{
    id : string;
    publicPlace : string;
    number : string;
    complement : string;
    district : string;
    cep : string;
    city : CidadeDTO;
}