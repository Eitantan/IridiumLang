using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.Threading;

public const string ROUND = "round";
ParserFunction.AddGlobal(Constants.ROUND, new RoundFunction());

AddTranslation(languageSection, Constants.ROUND);
