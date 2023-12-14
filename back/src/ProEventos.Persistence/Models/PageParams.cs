using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Persistence.Models
{
    public class PageParams
    {
        public const int maxPageSize = 50;

        public int PageNumber { get; set; } = 1;
        
        public int pageSize = 10;
        public int PageSize { 
            get {return pageSize;}
            set { pageSize = (value > maxPageSize ? maxPageSize : value);} 
        }

        public string Term { get; set; } = string.Empty;
    }
}