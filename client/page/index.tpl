{% extends 'home:page/layout.tpl' %}

{% block header %}
    {% widget "common:widget/tpl/header.tpl"%}
{% endblock %}

{% block footer %}
    {% widget "common:widget/tpl/footer.tpl"%}
{% endblock %}

{% block requireCss %}
    {% widget "common:widget/tpl/requireCss.tpl"%}
{% endblock %}

{% block requireJs %}
    {% widget "common:widget/tpl/requireJs.tpl"%}
{% endblock %}

{% block index %}
    {% widget "home:widget/entry/index.tpl"%}
{% endblock %}