from apps.core.models import Organization, User, Customer

def create_organization(name: str, slug: str) -> Organization:
    return Organization.objects.create(name=name, slug=slug)

def create_user_and_customer(
    organization: Organization,
    email: str,
    password_hash: str,
    full_name: str,
    role: str = "customer",
    cpf_cnpj: str = "",
    phone: str = "",
    shipping_address: dict | None = None
) -> tuple[User, Customer]:
    user = User.objects.create(
        email=email,
        password_hash=password_hash,
        full_name=full_name,
        role=role
    )
    customer = Customer.objects.create(
        organization=organization,
        user=user,
        cpf_cnpj=cpf_cnpj,
        phone=phone,
        default_shipping_address=shipping_address or {}
    )
    return user, customer
