using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeApi.Data;
using EmployeeApi.Models;

namespace EmployeeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public EmployeesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees(
            string? department,
            string? fullName,
            DateTime? birthDate,
            DateTime? hireDate,
            decimal? salary)
        {
            var query = _context.Employees.AsQueryable();

            if (!string.IsNullOrEmpty(department))
                query = query.Where(e => e.Department.Contains(department));
            if (!string.IsNullOrEmpty(fullName))
                query = query.Where(e => e.FullName.Contains(fullName));
            if (birthDate.HasValue)
                query = query.Where(e => e.BirthDate.Date == birthDate.Value.Date);
            if (hireDate.HasValue)
                query = query.Where(e => e.HireDate.Date == hireDate.Value.Date);
            if (salary.HasValue)
                query = query.Where(e => e.Salary == salary.Value);

            return await query.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> Create(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEmployees), new { id = employee.Id }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Employee employee)
        {
            if (id != employee.Id)
                return BadRequest();

            _context.Entry(employee).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound();

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
