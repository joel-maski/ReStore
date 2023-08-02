using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(StoreContext context,ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts(){
            var products = await _context.Products.ToListAsync();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProducts(int id){
            var product = await _context.Products.FindAsync(id);

            if(product == null) return NotFound();

            return product;
        }
    }
}