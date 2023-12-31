﻿using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Persistence.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly IEventoService _eventoService;
       
        public EventosController(IEventoService eventoService)
        {            
            _eventoService = eventoService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]PageParams pageParams)
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(pageParams, true);
                if(eventos == null) return NoContent();

                Response.AddPagination(eventos.TotalCount, eventos.CurrentPage, eventos.PageSize, eventos.TotalPages);

                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                   $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                 var evento = await _eventoService.GetEventoByIdAsync(id, true);
                 if(evento == null) return NoContent();
                 return Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                   $"Erro ao tentar recuperar evento. Erro: {ex.Message}");
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                 var evento = await _eventoService.AddEvento(model);
                 if(evento == null) return NoContent();
                 return Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                   $"Erro ao tentar adicionar evento. Erro: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model)
        {
            try
            {
                 var evento = await _eventoService.UpdateEvento(id, model);
                 if(evento == null) return NoContent();
                 return Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                   $"Erro ao tentar atualizar evento. Erro: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                 var evento = await _eventoService.GetEventoByIdAsync(id, true);
                 if(evento == null) return NoContent();
                 return await _eventoService.DeleteEvento(id)
                    ? Ok(new {message = "Deletadoy"})
                    : throw new Exception("Evento não deletado");
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                   $"Erro ao tentar deletar evento. Erro: {ex.Message}");
            }
        }
    }
}
