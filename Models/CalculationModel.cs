using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CryptoMaster.Models
{
    public class CalculationModel
    {
        public List<Purchase> Purchases { get; set; } = new List<Purchase>();
        public double Adjustment { get; set; }
    }

    public class Purchase
    {
        public string Name { get; set; }
        public double Amount { get; set; }
        public double Price { get; set; }
        public bool Enabled { get; set; }
    }
}
