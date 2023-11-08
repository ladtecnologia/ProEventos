using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        
        //LOCAL
        [ Required(ErrorMessage = "{0} é obrigatório") ]
        public string Local { get; set; }

        //DATA EVENTO
        [ Required(ErrorMessage = "{0} é obrigatório") ]
        public DateTime DataEvento { get; set; }

        //TEMA
        [ Required(ErrorMessage = "{0} é obrigatório") ]
        [ MinLength(4, ErrorMessage = "{0} deve ter no mínimo 4 caracteres") ]
        [ MaxLength(50, ErrorMessage = "{0} deve ter no máximo 50 caracteres") ]
        public string Tema { get; set; }

        //QTD PESSOAS
        [ Required(ErrorMessage = "{0} é obrigatório") ]
        [ Range(10, 1000, ErrorMessage = "{0} deve ter valor entre 10 e 1000")]
        public int QtdPessoas { get; set; }

        //IMAGEM URL
        [ Required(ErrorMessage = "{0} é obrigatório") ]
        [RegularExpression(@".*\.(jpe?g|bmp|png)$", ErrorMessage = "{0} inválida")]
        public string ImagemURL { get; set; }

        //TELEFONE
        [ Required(ErrorMessage = "{0} é obrigatório") ]
        [ Phone(ErrorMessage = "{0} inválido") ]
        public string Telefone { get; set; }

        //EMAIL
        [ Required(ErrorMessage = "{0} é obrigatório") ]
        [ EmailAddress(ErrorMessage = "{0} inválido") ]
        public string Email { get; set; }
        
        //NAO INCLUSOS
        //public IEnumerable<LoteDto> Lotes { get; set; }
        //public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        //public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}