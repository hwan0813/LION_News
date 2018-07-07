from __future__ import print_function
from textrankr import TextRank

textrank = TextRank("시는 인간의 삶을 반영한다. 시에서 반영은 현실과 인생을 모방한다는 의미에서 외부 현실을 시 속에 담아내는것으로, 역사와 현실의 상황을 시를 통해 어떻게 재현할것인가에 초점을 둔다. 여기서 반영은 ‘있는 그대로의 현실’로서의 반영과 ‘있어야 하는 현실’로서의 반영으로 구분할수 있다. 전자는 역사와 현실의 모습을 사실 그대로 보여주는 일상적 진실을 반영하는 것을 말하고, 후자는 일상적현실을 넘어 화자가 지향하는 당위적 진실을 반영하는 것을말한다.")
print(textrank.summarize())