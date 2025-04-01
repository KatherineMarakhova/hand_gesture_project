from django import forms


class FormConfig(forms.Form):
    hands_choices = [
        ('left', 'левая'),
        ('right', 'правая'),
        ('multi', 'нейро: обе руки')
    ]
    hands = forms.ChoiceField(widget=forms.RadioSelect, choices=hands_choices)
