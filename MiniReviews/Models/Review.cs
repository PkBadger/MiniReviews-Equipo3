using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MiniReviews.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Reviewer { get; set; }

        [Required]
        [Range(0,10, ErrorMessage = "Please enter a number between 1 and 10")]
        public int Rate { get; set; }

        [Required]
        public string Comments { get; set; }

        [Required]
        public int PlaceId { get; set; }

        [ForeignKey("PlaceId")]
        public virtual Place Place { get; set; }
        
    }
}