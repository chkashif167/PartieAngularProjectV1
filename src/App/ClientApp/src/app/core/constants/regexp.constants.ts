export class RegularExpConstants {
  static emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$'
  static passwordRegex = /(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\[\]<>\\{}~"+\x27|:;\.=\(\)\+\-\/,\?`])[a-zA-Z0-9!@#$%^&*()_\[\]<>\\{}~"\x27|:;\.=\(\)\+\-\/,\?`]{8,}$/;
}
