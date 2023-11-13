import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { BsGithub } from "react-icons/bs";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { GiFishing } from "react-icons/gi";
import { useTheme } from "next-themes";

const Navigation = ({ breadcrumbs }) => {
  const { theme, setTheme } = useTheme();
  return (
    <Navbar classNames={{ wrapper: "max-w-[2000px] px-10" }}>
      <NavbarBrand>
        <GiFishing className="mx-3 fill-blue-400" size="20" />
        <p className="font-bold text-inherit text-blue-400">Word Fisher</p>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem>
          <Breadcrumbs>
            {breadcrumbs.map((item) => (
              <BreadcrumbItem key={item.type} startContent={item.icon}>
                {item.name}
              </BreadcrumbItem>
            ))}
          </Breadcrumbs>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="shrink w-100" justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="https://github.com/comedu-cute-members/WordFisher"
            variant="flat"
            startContent={<BsGithub size="20" />}
          >
            GitHub
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Navigation;
