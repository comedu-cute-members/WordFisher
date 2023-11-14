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
import { ThemeSwitcher } from "./themeSwitcher";

const Navigation = ({ breadcrumbs }) => {
  return (
    <Navbar isBordered classNames={{ wrapper: "max-w-[2000px] px-10" }}>
      <NavbarBrand>
        <GiFishing className="mx-2 fill-blue-400" size="30" />
        <div className="font-bold text-blue-400">Word Fisher</div>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem>
          <Breadcrumbs>
            {breadcrumbs.map((item) => (
              <BreadcrumbItem
                key={item.type}
                startContent={item.icon}
                href={item.link}
              >
                {item.name}
              </BreadcrumbItem>
            ))}
          </Breadcrumbs>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="shrink w-100" justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            className="bg-zinc-600 dark:bg-zinc-800 text-zinc-200"
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
